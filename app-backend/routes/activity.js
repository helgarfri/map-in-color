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
        user_id,
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
        ),
        User:users(
          id,
          username,
          profile_picture
        )
      `)
      .eq('user_id', user_id)
      .eq('status', 'visible')
      .order('created_at', { ascending: false })
      .limit(1000);
    

      const commentedActivities = (userComments || []).map((c) => {
        const map = c.Map;
      
        let commentAuthorData = null;
        if (c.User) {
          commentAuthorData = {
            id: c.User.id,
            username: c.User.username,
            profile_picture: c.User.profile_picture,
          };
        }
      
        return {
          type: 'commented',
          created_at: c.created_at,
          commentContent: c.content,
          commentAuthor: commentAuthorData, // <-- add this
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
      1) Created, starred, commented 
      2) Notifications = other users starring/commenting
-------------------------------------------- */
router.get('/dashboard', auth, async (req, res) => {
    const user_id = req.user.id;

    const offset = parseInt(req.query.offset, 10) || 0;
    const limit  = parseInt(req.query.limit, 10) || 30;
  
    try {
      // ---------------------------------------------
      // (A) Get the user's own created maps
      // ---------------------------------------------
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
  
      // ---------------------------------------------
      // (B) Get the user's own "starred" maps
      // ---------------------------------------------
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
  
      // ---------------------------------------------
      // (C) Get the user’s own “commented” maps
      // ---------------------------------------------
      const { data: userComments } = await supabaseAdmin
      .from('comments')
      .select(`
        id,
        content,
        created_at,
        status,
        user_id,
        Map:maps(
          id, title, selected_map,
          ocean_color, unassigned_color, font_color,
          is_title_hidden, groups, data,
          save_count, created_at
        ),
        User:users(
          id,
          username,
          profile_picture
        )
      `)
      .eq('user_id', user_id)
      .eq('status', 'visible');
    
  
      const commentedActivities = (userComments || []).map((c) => ({
        type: 'commented',
        created_at: c.created_at,
        commentContent: c.content,
        map: c.Map
          ? {
              id: c.Map.id,
              title: c.Map.title,
              selected_map: c.Map.selected_map,
              ocean_color: c.Map.ocean_color,
              unassigned_color: c.Map.unassigned_color,
              font_color: c.Map.font_color,
              is_title_hidden: c.Map.is_title_hidden,
              groups: c.Map.groups,
              data: c.Map.data,
              save_count: c.Map.save_count,
              created_at: c.Map.created_at,
            }
          : null,
      }));
  
      // Combine the user’s own activity
      let userActivity = [
        ...createdActivities,
        ...starredActivities,
        ...commentedActivities,
      ];
  
      // ---------------------------------------------
      // (D) Fetch and enrich notifications
      //  => “other users” starring or commenting on *my* maps
      // ---------------------------------------------
      const { data: allNotifs, error: notiErr } = await supabaseAdmin
        .from('notifications')
        .select(`
          id,
          type,
          user_id,
          sender_id,
          map_id,
          comment_id,
          created_at,
          is_read
        `)
        .eq('user_id', user_id) // notifications for *this* user
        .order('created_at', { ascending: false });
  
      if (notiErr) {
        console.error('Error fetching notifications:', notiErr);
        return res.status(500).json({ msg: 'Server error' });
      }
  
      // If no notifications, just proceed with an empty array
      const notifications = allNotifs || [];
  
      // Gather all relevant IDs so we can fetch the data in 1-2 queries:
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
  
      // (D1) Fetch sender info
      let sendersById = {};
      if (senderIds.length > 0) {
        const { data: senders } = await supabaseAdmin
          .from('users')
          .select(`id, username, first_name, last_name, profile_picture, status, profile_visibility,
    star_notifications`)
          .in('id', senderIds);
  
        if (senders) {
          senders.forEach((s) => {
            sendersById[s.id] = s;
          });
        }
      }
  
      // (D2) Fetch maps for notifications
      let mapsById = {};
      if (mapIds.length > 0) {
        const { data: fetchedMaps } = await supabaseAdmin
          .from('maps')
          .select(`
            id, title, selected_map,
            ocean_color, unassigned_color, font_color,
            is_title_hidden, groups, data, save_count, created_at
          `)
          .in('id', mapIds);
        if (fetchedMaps) {
          fetchedMaps.forEach((m) => {
            mapsById[m.id] = m;
          });
        }
      }
  
      // (D3) Fetch comments for notifications
      let commentsById = {};
      if (commentIds.length > 0) {
        // We want the comment's content, status, user, etc.
        const { data: fetchedComments } = await supabaseAdmin
          .from('comments')
          .select(`
            id,
            content,
            status,
            user_id,
            User:users(
              id,
              username,
              profile_picture
            )
          `)
          .in('id', commentIds)
          .eq('status', 'visible');

        if (fetchedComments) {
          fetchedComments.forEach((c) => {
            commentsById[c.id] = c;
          });
        }
      }

  
        // (D4) Build “notifActivities” array
        let notifActivities = [];

        for (const n of notifications) {
          const sender = n.sender_id ? sendersById[n.sender_id] || null : null;
          const mapObj = n.map_id ? mapsById[n.map_id] || null : null;
          const commentObj = n.comment_id ? commentsById[n.comment_id] || null : null;

          // If this is a "star" notification (meaning n.type === "star" or "map_star" or something),
          // then we skip it entirely if the sender is private or has star_notifications off.
          if (
            (n.type === 'star' || n.type === 'map_star' /* adjust if needed */)
            && sender
            && (
              sender.star_notifications === false
            )
          ) {
            // skip adding this notification
            continue;
          }

          // Otherwise, proceed building the normal object
          let commentAuthorData = null;
          if (commentObj && commentObj.User) {
            commentAuthorData = {
              id: commentObj.User.id,
              username: commentObj.User.username,
              profile_picture: commentObj.User.profile_picture,
            };
          }

          notifActivities.push({
            type: `notification_${n.type}`,       // e.g. notification_star
            created_at: n.created_at,
            map: mapObj
              ? {
                  id: mapObj.id,
                  title: mapObj.title,
                  selected_map: mapObj.selected_map,
                  ocean_color: mapObj.ocean_color,
                  unassigned_color: mapObj.unassigned_color,
                  font_color: mapObj.font_color,
                  is_title_hidden: mapObj.is_title_hidden,
                  groups: mapObj.groups,
                  data: mapObj.data,
                  save_count: mapObj.save_count,
                  created_at: mapObj.created_at,
                }
              : null,
            commentContent: commentObj ? commentObj.content : null,
            commentAuthor: commentAuthorData,

            notificationData: {
              id: n.id,
              is_read: n.is_read,
              sender: sender,
            },
          });
        }

  
      // (E) Merge all activities + sort descending
      let allActivities = [...userActivity, ...notifActivities];
      allActivities.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      const offset = parseInt(req.query.offset, 10) || 0;
      const limit = parseInt(req.query.limit, 10) || 20;

      // Now slice out only the chunk
      const paginated = allActivities.slice(offset, offset + limit);

      // Return the chunk
      return res.json(paginated);

    } catch (err) {
      console.error('Error in GET /api/activity/dashboard:', err);
      return res.status(500).json({ msg: 'Server error' });
    }
    });
  
module.exports = router;
