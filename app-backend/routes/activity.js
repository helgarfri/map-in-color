// routes/activity.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { supabaseAdmin } = require('../config/supabase');

/**
 * GET /api/activity
 * Returns a merged feed of:
 *   - user-based activity (created maps, starred maps, commented)
 *   - notifications referencing the user’s maps
 */
router.get('/', auth, async (req, res) => {
  const user_id = req.user.id;

  try {
    // 1) "Created" maps
    const { data: createdMaps, error: createdErr } = await supabaseAdmin
      .from('maps')
      .select(`
        id, title, selected_map,
        ocean_color, unassigned_color, font_color,
        is_title_hidden, groups, data,
        save_count, created_at
      `)
      .eq('user_id', user_id);

    if (createdErr) {
      console.error('Error fetching created maps:', createdErr);
      return res.status(500).json({ msg: 'Server error' });
    }

    const createdActivities = (createdMaps || []).map((m) => ({
      type: 'createdMap',
      created_at: m.created_at,
      map: {
        id: m.id,
        title: m.title,
        selected_map: m.selected_map,
        ocean_color: m.ocean_color,
        unassigned_color: m.unassigned_color,
        font_color: m.font_color,
        is_title_hidden: m.is_title_hidden,
        groups: m.groups,
        data: m.data,
        save_count: m.save_count,
        created_at: m.created_at,
      },
      commentContent: null,
    }));

    // 2) "Starred" maps => from "map_saves"
    const { data: starredRows, error: starredErr } = await supabaseAdmin
      .from('map_saves')
      .select(`created_at, map_id, Map:maps(*)`)
      .eq('user_id', user_id);

    if (starredErr) {
      console.error('Error fetching starred maps:', starredErr);
      return res.status(500).json({ msg: 'Server error' });
    }

    const starredActivities = (starredRows || []).map((save) => {
      const m = save.Map;
      return {
        type: 'starredMap',
        created_at: save.created_at,
        map: m
          ? {
              id: m.id,
              title: m.title,
              selected_map: m.selected_map,
              ocean_color: m.ocean_color,
              unassigned_color: m.unassigned_color,
              font_color: m.font_color,
              is_title_hidden: m.is_title_hidden,
              groups: m.groups,
              data: m.data,
              save_count: m.save_count,
              created_at: m.created_at,
            }
          : null,
        commentContent: null,
      };
    });

    // 3) "Commented" => user posted comments
    const { data: userComments, error: commentsErr } = await supabaseAdmin
      .from('comments')
      .select(`
        id, content, created_at, status,
        Map:maps(
          id, title, selected_map,
          ocean_color, unassigned_color, font_color,
          is_title_hidden, groups, data,
          save_count, created_at
        )
      `)
      .eq('user_id', user_id)
      .eq('status', 'visible'); // only visible

    if (commentsErr) {
      console.error('Error fetching user comments:', commentsErr);
      return res.status(500).json({ msg: 'Server error' });
    }

    const commentedActivities = (userComments || []).map((c) => {
      const m = c.Map;
      return {
        type: 'commented',
        created_at: c.created_at,
        commentContent: c.content,
        map: m
          ? {
              id: m.id,
              title: m.title,
              selected_map: m.selected_map,
              ocean_color: m.ocean_color,
              unassigned_color: m.unassigned_color,
              font_color: m.font_color,
              is_title_hidden: m.is_title_hidden,
              groups: m.groups,
              data: m.data,
              save_count: m.save_count,
              created_at: m.created_at,
            }
          : null,
      };
    });

    // Combine user-based
    let userActivity = [
      ...createdActivities,
      ...starredActivities,
      ...commentedActivities,
    ];

    // 4) Fetch notifications
    const { data: allNotifs, error: notifErr } = await supabaseAdmin
      .from('notifications')
      .select(`
        id,
        type,
        map_id,
        comment_id,
        sender_id,
        created_at,
        is_read,
        Map:maps(*),
        Comment:comments(*),
        Sender:users!notifications_sender_id_fkey(id, username, first_name, status, profile_picture)
      `)
      .eq('user_id', user_id);

    if (notifErr) {
      console.error('Error fetching notifications:', notifErr);
      return res.status(500).json({ msg: 'Server error' });
    }

    // unify notifications
    const notifActivities = (allNotifs || []).map((n) => ({
      type: `notification_${n.type}`, 
      created_at: n.created_at,
      map: n.Map ? {
        id: n.Map.id,
        title: n.Map.title,
        selected_map: n.Map.selected_map,
        ocean_color: n.Map.ocean_color,
        // etc...
      } : null,
      commentContent: n.Comment?.content || null,
      notificationData: {
        id: n.id,
        is_read: n.is_read,
        sender: n.Sender || null,
      },
    }));

    // 5) Merge + sort
    let allActivities = [...userActivity, ...notifActivities];

    allActivities.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return res.json(allActivities);
  } catch (err) {
    console.error('Error in GET /api/activity:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
