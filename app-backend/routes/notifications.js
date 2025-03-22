const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { supabaseAdmin } = require('../config/supabase');
const { resend } = require('../config/resend'); // If you need it for emailing

// GET /api/notifications
router.get('/', auth, async (req, res) => {
  try {
    const user_id = req.user.id;

    // 1) Fetch all notifications for this user, newest first
    const { data: notifications, error: notiErr } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (notiErr) {
      console.error('Error fetching notifications:', notiErr);
      return res.status(500).json({ msg: 'Server error' });
    }

    // If no notifications, return empty array
    if (!notifications || notifications.length === 0) {
      return res.json([]);
    }

    // Collect sender_ids, map_ids, comment_ids
    const senderIds = [];
    const mapIds = [];
    const commentIds = [];

    notifications.forEach((n) => {
      if (n.sender_id && !senderIds.includes(n.sender_id)) {
        senderIds.push(n.sender_id);
      }
      if (n.map_id && !mapIds.includes(n.map_id)) {
        mapIds.push(n.map_id);
      }
      if (n.comment_id && !commentIds.includes(n.comment_id)) {
        commentIds.push(n.comment_id);
      }
    });

    // 2) Fetch senders (including status to check "banned")
    let sendersById = {};
    if (senderIds.length > 0) {
      const { data: senders, error: sendErr } = await supabaseAdmin
        .from('users')
        .select(`
          id,
          username,
          first_name,
          profile_picture,
          status,
          profile_visibility,
          star_notifications
        `)
        .in('id', senderIds);
    
      if (sendErr) {
        console.error('Error fetching senders:', sendErr);
      } else if (senders) {
        senders.forEach((s) => {
          sendersById[s.id] = s;
        });
      }
    }

    // 3) Fetch maps for map notifications
    let mapsById = {};
    if (mapIds.length > 0) {
      const { data: fetchedMaps, error: mapErr } = await supabaseAdmin
        .from('maps')
        .select(`
          id,
          title,
          selected_map,
          ocean_color,
          unassigned_color,
          groups,
          data,
          font_color,
          is_title_hidden,
          save_count
        `)
        .in('id', mapIds);

      if (mapErr) {
        console.error('Error fetching maps:', mapErr);
      } else if (fetchedMaps) {
        fetchedMaps.forEach((m) => {
          mapsById[m.id] = m;
        });
      }
    }

    // 4) Fetch only VISIBLE comments if comment_id is referenced
    //    and attach each comment’s owner to `Comment.Owner`
    let commentsById = {};
    if (commentIds.length > 0) {
      const { data: childComments, error: comErr } = await supabaseAdmin
        .from('comments')
        .select(`
          id,
          content,
          user_id,
          parent_comment_id,
          status
        `)
        .in('id', commentIds)
        .eq('status', 'visible'); // Only visible comments
      if (comErr) {
        console.error('Error fetching comments:', comErr);
      } else if (childComments) {
        // Store them in an object for easy lookup
        childComments.forEach((cmt) => {
          commentsById[cmt.id] = cmt;
        });

        // Gather parent_comment_ids to fetch parent text
        const parentIds = [
          ...new Set(childComments.map((c) => c.parent_comment_id).filter(Boolean)),
        ];

        // Gather user_ids (comment owners)
        const commentOwnerIds = childComments
          .map((cmt) => cmt.user_id)
          .filter(Boolean);
        const distinctOwnerIds = [...new Set(commentOwnerIds)];

        // Fetch comment owners
        let commentOwnersById = {};
        if (distinctOwnerIds.length > 0) {
          const { data: commentOwners, error: ownersErr } = await supabaseAdmin
            .from('users')
            .select('id, username, first_name, profile_picture, status')
            .in('id', distinctOwnerIds);
          if (ownersErr) {
            console.error('Error fetching comment owners:', ownersErr);
          } else if (commentOwners) {
            commentOwners.forEach((u) => {
              commentOwnersById[u.id] = u;
            });
          }
        }

        // Attach .Owner to each comment
        childComments.forEach((cmt) => {
          if (cmt.user_id && commentOwnersById[cmt.user_id]) {
            cmt.Owner = commentOwnersById[cmt.user_id];
          }
        });

        // Optionally fetch parent comments (for "reply" notifications)
        if (parentIds.length > 0) {
          const { data: parentRows } = await supabaseAdmin
            .from('comments')
            .select('id, content, status')
            .in('id', parentIds)
            .eq('status', 'visible');
          let parentsById = {};
          if (parentRows) {
            parentRows.forEach((p) => {
              parentsById[p.id] = p;
            });
          }

          // Attach parent content
          childComments.forEach((child) => {
            const parent = parentsById[child.parent_comment_id];
            if (parent) {
              child.ParentComment = {
                content: parent.content,
              };
            }
          });
        }
      }
    }

    // 5) Combine data into each notification object
    const enriched = notifications.map((n) => ({
      ...n,
      Sender: n.sender_id ? sendersById[n.sender_id] || null : null,
      Map: n.map_id ? mapsById[n.map_id] || null : null,
      Comment: n.comment_id ? commentsById[n.comment_id] || null : null,
    }));

    // 6) Filter out any notification from a banned sender
    const filtered = enriched.filter((n) => {
      // If there's no sender (e.g. system notification), we keep it
      if (!n.Sender) return true;
      // Exclude if sender is banned
      return n.Sender.status !== 'banned';
    });

    // 7) Filter out notifications referencing a hidden or missing comment
    const filtered2 = filtered.filter((n) => {
      if (!n.comment_id) return true; // no comment => keep
      return n.Comment !== null;     // keep only if comment is actually found & visible
    });

    // 8) **Now** filter out notifications from private accounts or star-disabled senders
    //    e.g. skip ANY notifications if user is private, or skip only "star" events
    //    depending on your policy

    const final = filtered2.filter((n) => {
      const s = n.Sender;
      // If no sender, keep
      if (!s) return true;

      // If this user is private => skip ALL notifications from them
      // (You can choose to skip only star notifications, or skip everything.)
      if (s.profile_visibility === 'onlyMe') {
        return false; // skip all
      }

      // If this is a star-type notification, skip if they disabled star notifications
      // (depending on your naming convention, check `n.type` or `notification_star` etc.)
      if (
        (n.type === 'star' || n.type === 'map_star' || n.type === 'notification_star')
        && s.star_notifications === false
      ) {
        return false;
      }

      // Otherwise, keep
      return true;
    });

    // 9) Return final
    return res.json(final);

      } catch (err) {
        console.error('Error fetching notifications:', err);
        return res.status(500).json({ msg: 'Server error' });
      }
    });

// PUT /api/notifications/:id/read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notificationId = req.params.id;
    const user_id = req.user.id;

    // Check if notification belongs to this user
    const { data: notif, error: findErr } = await supabaseAdmin
      .from('notifications')
      .select('id, user_id, is_read')
      .eq('id', notificationId)
      .eq('user_id', user_id)
      .maybeSingle();

    if (findErr) {
      console.error(findErr);
      return res.status(500).json({ msg: 'Error fetching notification' });
    }
    if (!notif) {
      return res.status(404).json({ msg: 'Notification not found' });
    }

    // Mark as read
    const { error: updateErr } = await supabaseAdmin
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (updateErr) {
      console.error(updateErr);
      return res.status(500).json({ msg: 'Error marking notification read' });
    }

    return res.json({ msg: 'Notification marked as read' });
  } catch (err) {
    console.error('Error updating notification:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// PUT /api/notifications/read-all
router.put('/read-all', auth, async (req, res) => {
  try {
    const user_id = req.user.id;

    const { error } = await supabaseAdmin
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user_id)
      .eq('is_read', false);

    if (error) {
      console.error(error);
      return res.status(500).json({ msg: 'Error marking notifications read' });
    }

    return res.json({ msg: 'All notifications marked as read' });
  } catch (err) {
    console.error('Error updating notifications:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE /api/notifications/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const notificationId = req.params.id;
    const user_id = req.user.id;

    // Check ownership
    const { data: notif } = await supabaseAdmin
      .from('notifications')
      .select('id, user_id')
      .eq('id', notificationId)
      .eq('user_id', user_id)
      .maybeSingle();

    if (!notif) {
      return res.status(404).json({ msg: 'Notification not found' });
    }

    const { error: delErr } = await supabaseAdmin
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (delErr) {
      console.error('Error deleting notification:', delErr);
      return res.status(500).json({ msg: 'Server error' });
    }

    return res.json({ msg: 'Notification deleted successfully' });
  } catch (err) {
    console.error('Error deleting notification:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
