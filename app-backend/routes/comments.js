const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const auth = require('../middleware/auth');
const authOptional = require('../middleware/authOptional');
const { resend } = require('../config/resend'); //  <-- import Resend client

/* -----------------------------------------------
   GET /maps/:mapId/comments (Fetch comments + replies)
   Exclude any comments from banned users
----------------------------------------------- */
router.get('/maps/:mapId/comments', authOptional, async (req, res) => {
  try {
    const mapId = parseInt(req.params.mapId, 10);
    const user_id = req.user?.id || null;

    // 1) Fetch ALL visible comments for this map (top-level + replies + reply-to-replies...)
    const { data: allCommentsRaw, error } = await supabaseAdmin
      .from('comments')
      .select(`
        *,
        user:users!comments_user_id_fkey (
          id,
          username,
          first_name,
          last_name,
          profile_picture,
          status,
          plan
        )
      `)
      .eq('map_id', mapId)
      .eq('status', 'visible');

    if (error) {
      console.error('Error fetching comments:', error);
      return res.status(500).json({ msg: 'Server error' });
    }

    // 2) Build userReactions map if logged in
    let userReactions = {};
    if (user_id) {
      const { data: myReactions, error: rErr } = await supabaseAdmin
        .from('comment_reactions')
        .select('comment_id, reaction')
        .eq('user_id', user_id);

      if (!rErr && myReactions) {
        myReactions.forEach((r) => {
          userReactions[r.comment_id] = r.reaction; // 'like' | 'dislike'
        });
      }
    }

    // 3) Filter out banned users
    const allComments = (allCommentsRaw || []).filter(
      (c) => c.user && c.user.status !== 'banned'
    );

    function computeWilsonScore(likes, dislikes) {
      const n = (likes || 0) + (dislikes || 0);
      if (n === 0) return 0;
      const z = 1.96;
      const p = (likes || 0) / n;
      const z2 = z * z;
      const left = p + z2 / (2 * n);
      const right = z * Math.sqrt((p * (1 - p) + z2 / (4 * n)) / n);
      const denom = 1 + z2 / n;
      return (left - right) / denom;
    }

    // 4) Create nodes map
    const byId = new Map();
    for (const c of allComments) {
      const node = {
        ...c,
        userReaction: userReactions[c.id] || null,
        wilsonScore: computeWilsonScore(c.like_count || 0, c.dislike_count || 0),
        Replies: [], // children
      };
      byId.set(c.id, node);
    }

    // 5) Attach children to parents (any depth)
    const roots = [];
    for (const node of byId.values()) {
      const parentId = node.parent_comment_id;
      if (parentId && byId.has(parentId)) {
        byId.get(parentId).Replies.push(node);
      } else {
        // parent is null OR missing (deleted/orphan) -> treat as top-level
        roots.push(node);
      }
    }

    // 6) Sort recursively by wilsonScore (desc)
    function sortTree(nodes) {
      nodes.sort((a, b) => (b.wilsonScore || 0) - (a.wilsonScore || 0));
      for (const n of nodes) sortTree(n.Replies);
    }
    sortTree(roots);

    return res.json(roots);
  } catch (err) {
    console.error('Error in GET /maps/:mapId/comments:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});


/* -----------------------------------------------
   POST /maps/:mapId/comments (Create a new comment)
   ----------------------------------------------- */
   router.post('/maps/:mapId/comments', auth, async (req, res) => {
    try {
      const mapId = parseInt(req.params.mapId, 10);
      const { content, parent_comment_id } = req.body;
      const user_id = req.user.id;
  
      // 1) Check if the map exists
      const { data: mapRow, error: mapErr } = await supabaseAdmin
        .from('maps')
        .select('id, title, user_id')
        .eq('id', mapId)
        .maybeSingle();
  
      if (mapErr) {
        console.error('Error fetching map:', mapErr);
        return res.status(500).json({ msg: 'Error fetching map' });
      }
      if (!mapRow) {
        return res.status(404).json({ msg: 'Map not found' });
      }
  
      // 2) Check if parent_comment_id is valid (if present)
      let parentCommentUserId = null;  // <-- added for replies
      if (parent_comment_id) {
        const { data: parentComment, error: parentErr } = await supabaseAdmin
          .from('comments')
          .select('id, user_id, map_id')   // note we also fetch user_id now
          .eq('id', parent_comment_id)
          .maybeSingle();
  
        if (parentErr) {
          console.error('Error checking parent comment:', parentErr);
          return res.status(500).json({ msg: 'Server error' });
        }
        if (!parentComment || parentComment.map_id !== mapId) {
          return res.status(400).json({ msg: 'Invalid parent comment' });
        }
  
        parentCommentUserId = parentComment.user_id;  // <-- store for notification
      }
  
      // 3) Insert new comment
      const { data: inserted, error: insertErr } = await supabaseAdmin
        .from('comments')
        .insert({
          content,
          user_id,
          map_id: mapRow.id,
          parent_comment_id: parent_comment_id || null,
          like_count: 0,
          dislike_count: 0,
        })
        .select('*')
        .single();
  
      if (insertErr) {
        console.error('Error inserting comment:', insertErr);
        return res.status(500).json({ msg: 'Error inserting comment' });
      }
  
      // 4) Fetch the newly inserted comment with user data
      const { data: fullComment, error: fullErr } = await supabaseAdmin
        .from('comments')
        .select(
          `*,
           user:users!comments_user_id_fkey (
             id,
             username,
             first_name,
             last_name,
             profile_picture
           )`
        )
        .eq('id', inserted.id)
        .maybeSingle();
  
      if (fullErr) {
        console.error('Error fetching full comment:', fullErr);
        return res.json(inserted);
      }
  
      // 5) If it’s a top-level comment, notify the map owner (if different user)
      if (!parent_comment_id) {
        if (mapRow.user_id !== user_id) {
          await supabaseAdmin
            .from('notifications')
            .insert([{
              type: 'comment',
              user_id: mapRow.user_id,  // the map owner
              sender_id: user_id,       // the commenter
              map_id: mapRow.id,
              comment_id: inserted.id,  // optional: store comment ID
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }]);
        }
      } else {
        // 6) If it’s a reply, notify the parent comment’s author if different
        if (parentCommentUserId && parentCommentUserId !== user_id) {
          await supabaseAdmin
            .from('notifications')
            .insert([{
              type: 'reply',                 // e.g. "reply"
              user_id: parentCommentUserId,  // the parent comment's author
              sender_id: user_id,           // the replier
              map_id: mapRow.id,
              comment_id: inserted.id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }]);
        }
      }
  
      return res.json(fullComment);
    } catch (err) {
      console.error('Error posting comment:', err);
      return res.status(500).json({ msg: 'Server error' });
    }
  });
  

/* -----------------------------------------------
   POST /comments/:comment_id/reaction
   Toggles or sets a single user’s reaction
----------------------------------------------- */
router.post('/comments/:comment_id/reaction', auth, async (req, res) => {
  try {
    const comment_id = parseInt(req.params.comment_id, 10);
    const userId = req.user.id;
    let newReaction = req.body.reaction; // 'like' | 'dislike' | null

    console.log(
      `[DEBUG] Reaction => userId=${userId}, comment_id=${comment_id}, newReaction=${newReaction}`
    );

    // 1) Fetch the comment row
    const { data: comment, error: cErr } = await supabaseAdmin
      .from('comments')
      .select('id, user_id, map_id, like_count, dislike_count, parent_comment_id')
      .eq('id', comment_id)
      .maybeSingle();
    if (cErr) {
      console.error('Error fetching comment:', cErr);
      return res.status(500).json({ msg: 'Error fetching comment' });
    }
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    const { user_id: commentOwnerId, map_id, parent_comment_id } = comment;
    let { like_count, dislike_count } = comment;

    // 2) fetch existing reaction, if any
    const { data: existing, error: eErr } = await supabaseAdmin
      .from('comment_reactions')
      .select('*')
      .eq('comment_id', comment_id)
      .eq('user_id', userId)
      .maybeSingle();

    if (eErr) {
      console.error('Error fetching user reaction:', eErr);
      return res.status(500).json({ msg: 'Server error (fetch reaction)' });
    }

    // 3) If the user is repeating the same reaction => remove it
    if (existing && existing.reaction === newReaction) {
      // e.g. user already had 'like', clicked 'like' again => remove
      newReaction = null;
    }

    // 4) Toggling logic
    if (!newReaction) {
      // user wants no reaction
      if (existing?.reaction === 'like') {
        like_count = Math.max(0, like_count - 1);
      } else if (existing?.reaction === 'dislike') {
        dislike_count = Math.max(0, dislike_count - 1);
      }

      // remove row from comment_reactions
      if (existing) {
        await supabaseAdmin
          .from('comment_reactions')
          .delete()
          .eq('id', existing.id);
      }
    } else if (newReaction === 'like') {
      // user wants 'like'
      if (existing?.reaction === 'dislike') {
        // remove old dislike
        dislike_count = Math.max(0, dislike_count - 1);
        // update the old row
        await supabaseAdmin
          .from('comment_reactions')
          .update({ reaction: 'like' })
          .eq('id', existing.id);
      } else if (!existing) {
        // insert new reaction row
        await supabaseAdmin
          .from('comment_reactions')
          .insert([
            {
              user_id: userId,
              comment_id,
              reaction: 'like',
            },
          ]);
      }
      like_count += 1;

      // *** CREATE NOTIFICATION if liking someone else’s comment ***
      // (only if not the comment's author)
      if (commentOwnerId !== userId) {
        await supabaseAdmin.from('notifications').insert([
          {
            type: 'like',
            user_id: commentOwnerId, // the comment owner gets the notification
            sender_id: userId,       // the user who liked
            map_id: map_id,          // optional, so we can show "on map X"
            comment_id: comment_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
      }
    } else if (newReaction === 'dislike') {
      // user wants 'dislike'
      if (existing?.reaction === 'like') {
        like_count = Math.max(0, like_count - 1);
        await supabaseAdmin
          .from('comment_reactions')
          .update({ reaction: 'dislike' })
          .eq('id', existing.id);
      } else if (!existing) {
        // insert new
        await supabaseAdmin
          .from('comment_reactions')
          .insert([
            {
              user_id: userId,
              comment_id,
              reaction: 'dislike',
            },
          ]);
      }
      dislike_count += 1;

      // Optional: you could also do "someone disliked your comment" 
      // but many sites don't notify for "dislikes" since it can be negative.
      // If you do want that, do similarly:
      // if (commentOwnerId !== userId) { ... insert type: 'dislike' ... }
    }

    // 5) update the comment counters
    const { data: updatedRows, error: updErr } = await supabaseAdmin
      .from('comments')
      .update({
        like_count,
        dislike_count,
      })
      .eq('id', comment_id)
      .select()
      .maybeSingle();

    if (updErr) {
      console.error('Error updating like_count/dislike_count:', updErr);
      return res.status(500).json({ msg: 'Error updating comment counters' });
    }

    // Return the updated row + the final userReaction
    return res.json({
      ...updatedRows,
      userReaction: newReaction, // 'like', 'dislike', or null
    });
  } catch (err) {
    console.error('Error in reaction route:', err);
    return res.status(500).json({ msg: 'Server error (reaction)' });
  }

  
});

/* -----------------------------------------------
   DELETE /comments/:comment_id
   Delete a comment (either author OR map owner)
----------------------------------------------- */
router.delete('/comments/:comment_id', auth, async (req, res) => {
  try {
    const commentId = parseInt(req.params.comment_id, 10);
    const user_id = req.user.id;

    // 1) Fetch the comment (including map_id)
    const { data: comment, error: cErr } = await supabaseAdmin
      .from('comments')
      .select('id, user_id, map_id')
      .eq('id', commentId)
      .maybeSingle();

    if (cErr) {
      console.error('Error fetching comment:', cErr);
      return res.status(500).json({ msg: 'Server error (fetch comment)' });
    }
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    // 2) Check if the user is EITHER the comment’s author OR the map owner
    const { data: mapOwnerCheck, error: moErr } = await supabaseAdmin
      .from('maps')
      .select('user_id')
      .eq('id', comment.map_id)
      .maybeSingle();

    if (moErr) {
      console.error('Error checking map ownership:', moErr);
      return res.status(500).json({ msg: 'Server error (map ownership)' });
    }

    // If neither the comment author nor the map owner
    if (comment.user_id !== user_id && mapOwnerCheck?.user_id !== user_id) {
      return res
        .status(403)
        .json({ msg: 'You do not have permission to delete this comment.' });
    }

    // 3) Delete the comment
    const { error: delErr } = await supabaseAdmin
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (delErr) {
      console.error('Error deleting comment:', delErr);
      return res.status(500).json({ msg: 'Server error (delete comment)' });
    }

    return res.json({ msg: 'Comment deleted successfully' });
  } catch (err) {
    console.error('Error in DELETE /comments/:comment_id:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

/* -----------------------------------------------
   POST /comments/:comment_id/report
   Only hide the comment after it has been reported by >= 2 distinct users
------------------------------------------------ */
router.post('/comments/:comment_id/report', auth, async (req, res) => {
  try {
    const comment_id = parseInt(req.params.comment_id, 10);
    const { reasons, details } = req.body; 
    const user_id = req.user.id;

    // 1) Check if comment exists
    const { data: comment, error: commentErr } = await supabaseAdmin
      .from('comments')
      .select('id, user_id, status')
      .eq('id', comment_id)
      .maybeSingle();

    if (commentErr) throw commentErr;
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    // 2) Insert a new row into comment_reports
    const { error: reportErr } = await supabaseAdmin
      .from('comment_reports')
      .insert({
        comment_id,
        reported_by: user_id,
        reasons,
        details,
        status: 'pending'
      });
    if (reportErr) throw reportErr;

    // 3) Check how many unique users have reported this comment so far
    const { data: allReports, error: allRepErr } = await supabaseAdmin
      .from('comment_reports')
      .select('reported_by')
      .eq('comment_id', comment_id);

    if (allRepErr) throw allRepErr;

    // Create a set of distinct user IDs
    const distinctUsers = new Set(allReports.map((r) => r.reported_by));
    const reportCount = distinctUsers.size;

    // 4) Hide the comment only if it has 2 or more unique reporters
    if (reportCount >= 2) {
      // Hide or 'pending_review' — your choice
      const { error: hideErr } = await supabaseAdmin
        .from('comments')
        .update({ status: 'hidden' })
        .eq('id', comment_id);
      if (hideErr) throw hideErr;
    }


   // 4.5) Send emails to both the user and admin
   //   a) Fetch the user's email from the "users" table
   const { data: reportingUser, error: userErr } = await supabaseAdmin
     .from('users')
     .select('email, username')
     .eq('id', user_id)
     .maybeSingle();

   if (userErr) {
     console.error('Error fetching user email:', userErr);
   }
   // It's good to check if reportingUser was found
   // but even if not, you may still want to continue. 
   // For safety:
   const userEmail = reportingUser?.email;
   const userName = reportingUser?.username || 'unknown-user';

   //   b) Send a confirmation email to the user who submitted the report
   if (userEmail) {
     try {
       await resend.emails.send({
         from: 'no-reply@mapincolor.com',
         to: userEmail,
         subject: 'We have received your report',
         text: `Hello ${userName},\n\n` +
               `We have received your report regarding comment #${comment_id}.\n` +
               `Reasons: ${reasons}\nDetails: ${details}\n\n` +
               `Thank you for helping us keep the community safe.\n` +
               `- The Map in Color team`
       });
     } catch (emailErr) {
       console.error('Error sending user confirmation email:', emailErr);
     }
   }

   //   c) Send an email to admin with the details
   //      So you (hello@mapincolor.com) are aware that a new report just came in
   try {
     await resend.emails.send({
       from: 'no-reply@mapincolor.com',
       to: 'hello@mapincolor.com',
       subject: `New comment report (#${comment_id})`,
       text: `A user has reported comment #${comment_id}\n` +
             `Reporter: ${userName} (ID: ${user_id}, email: ${userEmail})\n` +
             `Reasons: ${reasons}\n` +
           `Details: ${details}\n\n` +
             `Total unique reporters so far: ${reportCount}\n`
     });
   } catch (emailAdminErr) {
     console.error('Error sending admin notification email:', emailAdminErr);
   }

    

    // 5) Optionally send notifications/emails, etc.
    // if (reportCount >= 2) { ... send "the comment is now hidden" email to original author ... }

    return res.json({
      msg: `Comment reported successfully. This comment now has ${reportCount} total unique report(s).`
    });
  } catch (err) {
    console.error('Error reporting comment:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});






module.exports = router;