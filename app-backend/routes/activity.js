// routes/activity.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { supabaseAdmin } = require('../config/supabase');

/* --------------------------------------------
   GET /api/activity/profile/:username
   => (Public or partial-auth)
   => Return only “profile-based” activity:
       - Created maps, starred maps, commented
     for the specified username.
-------------------------------------------- */
router.get('/profile/:username', async (req, res) => {
  const { username } = req.params;
  const offset = parseInt(req.query.offset, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || 10;

  try {
    // 1) find the user record by username
    const { data: foundUser, error: userErr } = await supabaseAdmin
      .from('users')
      .select('id, username, first_name, last_name, profile_picture')
      .eq('username', username)
      .maybeSingle();

    if (userErr) {
      console.error(userErr);
      return res.status(500).json({ msg: 'Error fetching user' });
    }
    if (!foundUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const user_id = foundUser.id;

    // 2a) “Created” maps by this user
    const { data: createdMaps } = await supabaseAdmin
      .from('maps')
      .select(`
        id,
        title,
        selected_map,
        ocean_color,
        unassigned_color,
        font_color,
        is_title_hidden,
        groups,
        data,
        save_count,
        created_at
      `)
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(1000); 
      // or just fetch all then apply .slice() below

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

    // 2b) “Starred” maps => from “map_saves”
    const { data: starredRows } = await supabaseAdmin
      .from('map_saves')
      .select(`
        created_at,
        map_id,
        Map:maps(*)
      `)
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(1000);

    const starredActivities = (starredRows || []).map((save) => {
      const map = save.Map;
      return {
        type: 'starredMap',
        created_at: save.created_at,
        map: map
          ? {
              id: map.id,
              title: map.title,
              selected_map: map.selected_map,
              ocean_color: map.ocean_color,
              unassigned_color: map.unassigned_color,
              font_color: map.font_color,
              is_title_hidden: map.is_title_hidden,
              groups: map.groups,
              data: map.data,
              save_count: map.save_count,
              created_at: map.created_at,
            }
          : null,
        commentContent: null,
      };
    });

    // 2c) “Commented” => user posted comments (visible)
    const { data: userComments } = await supabaseAdmin
      .from('comments')
      .select(`
        id,
        content,
        created_at,
        status,
        Map:maps(
          id,
          title,
          selected_map,
          ocean_color,
          unassigned_color,
          font_color,
          is_title_hidden,
          groups,
          data,
          save_count,
          created_at
        )
      `)
      .eq('user_id', user_id)
      .eq('status', 'visible')
      .order('created_at', { ascending: false })
      .limit(1000);

    const commentedActivities = (userComments || []).map((c) => {
      const map = c.Map;
      return {
        type: 'commented',
        created_at: c.created_at,
        commentContent: c.content,
        map: map
          ? {
              id: map.id,
              title: map.title,
              selected_map: map.selected_map,
              ocean_color: map.ocean_color,
              unassigned_color: map.unassigned_color,
              font_color: map.font_color,
              is_title_hidden: map.is_title_hidden,
              groups: map.groups,
              data: map.data,
              save_count: map.save_count,
              created_at: map.created_at,
            }
          : null,
      };
    });

    // 3) Combine them
    let allActivities = [
      ...createdActivities,
      ...starredActivities,
      ...commentedActivities,
    ];

    // 4) Sort descending by created_at
    allActivities.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // 5) offset + limit
    const paginated = allActivities.slice(offset, offset + limit);

    return res.json(paginated);
  } catch (err) {
    console.error('Error in GET /api/activity/profile/:username:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});


/* --------------------------------------------
   GET /api/activity/dashboard
   => (Requires auth)
   => Return “merged feed” for *this* user:
      - created, starred, commented 
      - plus notifications
-------------------------------------------- */
router.get('/dashboard', auth, async (req, res) => {
  const user_id = req.user.id;

  try {
    // 1) “Created” maps
    const { data: createdMaps } = await supabaseAdmin
      .from('maps')
      .select(`
        id, title, selected_map,
        ocean_color, unassigned_color, font_color,
        is_title_hidden, groups, data,
        save_count, created_at
      `)
      .eq('user_id', user_id);

    const createdActivities = (createdMaps || []).map((m) => ({
      type: 'createdMap',
      created_at: m.created_at,
      map: {
        id: m.id,
        title: m.title,
        selected_map: m.selected_map,
        // ...the rest
      },
      commentContent: null,
    }));

    // 2) “Starred” maps => from “map_saves”
    const { data: starredRows } = await supabaseAdmin
      .from('map_saves')
      .select(`created_at, map_id, Map:maps(*)`)
      .eq('user_id', user_id);

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
              // ...
            }
          : null,
        commentContent: null,
      };
    });

    // 3) “Commented” => user posted comments (visible)
    const { data: userComments } = await supabaseAdmin
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
      .eq('status', 'visible');

    const commentedActivities = (userComments || []).map((c) => ({
      type: 'commented',
      created_at: c.created_at,
      commentContent: c.content,
      map: c.Map || null,
    }));

    // combine user-based
    let userActivity = [
      ...createdActivities,
      ...starredActivities,
      ...commentedActivities,
    ];

    // 4) fetch notifications
    const { data: allNotifs } = await supabaseAdmin
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
        Sender:users!notifications_sender_id_fkey(id, username, profile_picture, status)
      `)
      .eq('user_id', user_id);

    const notifActivities = (allNotifs || []).map((n) => ({
      type: `notification_${n.type}`, 
      created_at: n.created_at,
      map: n.Map || null,
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
    console.error('Error in GET /api/activity/dashboard:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
