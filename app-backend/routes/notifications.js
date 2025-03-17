// routes/notifications.js

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

    if (!notifications || notifications.length === 0) {
      return res.json([]); // No notifications
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

    // 3) Fetch maps for map notifications (if needed)
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
    //    So if a comment is hidden or doesn't exist, we'll skip it later
    let commentsById = {};
    if (commentIds.length > 0) {
      // fetch child comments
      const { data: childComments, error: comErr } = await supabaseAdmin
        .from('comments')
        .select(`
          id,
          content,
          parent_comment_id,
          status
        `)
        .in('id', commentIds)
        .eq('status', 'visible');  // Only visible
      if (comErr) {
        console.error('Error fetching child comments:', comErr);
      } else if (childComments) {
        // store them by ID
        childComments.forEach((cmt) => {
          commentsById[cmt.id] = cmt;
        });

        // Optionally fetch parent comments to show them
        let parentIds = [];
        childComments.forEach((c) => {
          if (c.parent_comment_id) parentIds.push(c.parent_comment_id);
        });
        parentIds = [...new Set(parentIds)];

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

          // attach parent content to the child
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

    // 5) Combine data into each notification
    const enriched = notifications.map((n) => {
      return {
        ...n,
        Sender: n.sender_id ? sendersById[n.sender_id] || null : null,
        Map: n.map_id ? mapsById[n.map_id] || null : null,
        Comment: n.comment_id ? commentsById[n.comment_id] || null : null,
      };
    });

    // 6) Filter out any notification from a banned sender
    const filtered = enriched.filter((n) => {
      if (!n.Sender) return true;  // maybe system notification with no sender
      return n.Sender.status !== 'banned';
    });

    // 7) Filter out notifications referencing a hidden comment
    //    i.e. if n.comment_id but n.Comment == null => hidden
    const final = filtered.filter((n) => {
      if (!n.comment_id) return true; // no comment => keep
      return n.Comment !== null;     // keep only if comment is visible
    });

    res.json(final);
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

    // Check if notification belongs to user
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

    res.json({ msg: 'Notification marked as read' });
  } catch (err) {
    console.error('Error updating notification:', err);
    res.status(500).json({ msg: 'Server error' });
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

    res.json({ msg: 'All notifications marked as read' });
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

    // check ownership
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

    res.json({ msg: 'Notification deleted successfully' });
  } catch (err) {
    console.error('Error deleting notification:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
