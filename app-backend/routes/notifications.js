const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Import the service_role client
const { supabaseAdmin } = require('../config/supabase');

/* --------------------------------------------
   GET /api/notifications
   Fetch all notifications for the logged-in user
-------------------------------------------- */
/* --------------------------------------------
   GET /api/notifications
   Fetch all notifications for the logged-in user
   BUT skip any that reference hidden comments
-------------------------------------------- */
router.get('/', auth, async (req, res) => {
  try {
    const user_id = req.user.id;

    // 1) Fetch all notifications for this user
    const { data: notifications, error: notiErr } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (notiErr) {
      console.error('Error fetching notifications:', notiErr);
      return res.status(500).json({ msg: 'Server error' });
    }

    // If none found, return empty
    if (!notifications || notifications.length === 0) {
      return res.json([]);
    }

    // 2) Gather unique sender_ids, map_ids, comment_ids
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

    // 3) Fetch sender users
    let sendersById = {};
    if (senderIds.length > 0) {
      const { data: senders, error: sendErr } = await supabaseAdmin
        .from('users')
        .select('id, username, first_name, profile_picture, status')
        .in('id', senderIds);

      if (sendErr) {
        console.error('Error fetching senders:', sendErr);
      } else if (senders) {
        senders.forEach((s) => {
          sendersById[s.id] = s;
        });
      }
    }

    // 4) Fetch maps
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

    // 5) Fetch only the VISIBLE child comments
    //    (this means hidden comments won't show up at all)
    let commentsById = {};
    if (commentIds.length > 0) {
      const { data: childComments, error: comErr } = await supabaseAdmin
        .from('comments')
        .select(`
          id,
          content,
          parent_comment_id,
          status
        `)
        .in('id', commentIds)
        .eq('status', 'visible');  // <--- ONLY get visible

      if (comErr) {
        console.error('Error fetching child comments:', comErr);
      } else if (childComments) {
        // Put them in a map
        childComments.forEach((cmt) => {
          commentsById[cmt.id] = cmt;
        });

        // 5a) gather parent IDs of these visible comments
        let parentIds = [];
        childComments.forEach((c) => {
          if (c.parent_comment_id) {
            parentIds.push(c.parent_comment_id);
          }
        });
        parentIds = [...new Set(parentIds)]; // unique

        if (parentIds.length > 0) {
          // 5b) fetch parent comments (also only if they are visible, if you prefer)
          const { data: parentRows } = await supabaseAdmin
            .from('comments')
            .select('id, content, status')
            .in('id', parentIds)
            .eq('status', 'visible');  // <--- also only if parent is visible

          let parentsById = {};
          if (parentRows) {
            parentRows.forEach((p) => {
              parentsById[p.id] = p;
            });
          }

          // 5c) attach each parent's content to the child
          childComments.forEach((child) => {
            const parent = parentsById[child.parent_comment_id];
            if (child.parent_comment_id && parent) {
              child.ParentComment = {
                content: parent.content,
              };
            }
          });
        }
      }
    }

    // 6) Merge data into each notification
    const enriched = notifications.map((n) => {
      const childCmt = n.comment_id ? commentsById[n.comment_id] : null;
      return {
        ...n,
        Sender: n.sender_id ? sendersById[n.sender_id] || null : null,
        Map: n.map_id ? mapsById[n.map_id] || null : null,
        Comment: childCmt || null,
      };
    });

    //6.5) filter out notifications from banned senders

    const filtered = enriched.filter((n) => {
      if (!n.Sender) return true;
      return n.Sender.status !== 'banned';
    });

    // 7) Filter out all notifications referencing a non-visible (null) comment
    //    i.e. if n.comment_id was hidden or doesn't exist, remove it
    const final = enriched.filter((n) => {
      // If there's no comment_id, it might be a notification about a map, etc. 
      // so we might want to keep it. 
      // But if it references a comment_id, then we only keep if n.Comment != null
      if (!n.comment_id) return true;  // e.g. a "map saved" or "follow" notification
      return n.Comment !== null;       // keep only if we have a visible comment
    });

    res.json(final);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});


/* --------------------------------------------
   PUT /api/notifications/:id/read
   Mark a single notification as read
-------------------------------------------- */
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notificationId = req.params.id;
    const user_id = req.user.id;

    // 1) Check if the notification belongs to this user
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

    // 2) Update is_read = true
    const { error: updateErr } = await supabaseAdmin
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (updateErr) {
      console.error(updateErr);
      return res.status(500).json({ msg: 'Error marking notification read' });
    }

    res.json({ msg: 'Notification marked as read' });
  } catch (err) {
    console.error('Error updating notification:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

/* --------------------------------------------
   PUT /api/notifications/read-all
   Mark all notifications as read
-------------------------------------------- */
router.put('/read-all', auth, async (req, res) => {
  try {
    const user_id = req.user.id;

    // Mark all notifications for this user as read
    const { error } = await supabaseAdmin
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user_id)
      .eq('is_read', false);

    if (error) {
      console.error(error);
      return res.status(500).json({ msg: 'Error marking notifications read' });
    }

    res.json({ msg: 'All notifications marked as read' });
  } catch (err) {
    console.error('Error updating notifications:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

/* --------------------------------------------
   DELETE /api/notifications/:id
   Delete a notification
-------------------------------------------- */
router.delete('/:id', auth, async (req, res) => {
  try {
    const notificationId = req.params.id;
    const user_id = req.user.id;

    // 1) Check if it belongs to user
    const { data: notif } = await supabaseAdmin
      .from('notifications')
      .select('id, user_id')
      .eq('id', notificationId)
      .eq('user_id', user_id)
      .maybeSingle();

    if (!notif) {
      return res.status(404).json({ msg: 'Notification not found' });
    }

    // 2) delete
    const { error: delErr } = await supabaseAdmin
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (delErr) {
      console.error('Error deleting notification:', delErr);
      return res.status(500).json({ msg: 'Server error' });
    }

    res.json({ msg: 'Notification deleted successfully' });
  } catch (err) {
    console.error('Error deleting notification:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
