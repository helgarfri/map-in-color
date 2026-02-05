// routes/activity.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { supabaseAdmin } = require('../config/supabase');

/* ─────────────────────────────────────────────────────────────
   Helpers
   Goal: ensure feed payload ALWAYS includes:
   - groups (categorical groups with countries) OR
   - custom_ranges (choropleth ranges)
   - map_data_type (so frontend never has to guess)

   Also: migrate legacy “ranges stored in groups” -> custom_ranges
───────────────────────────────────────────────────────────── */

function looksLikeRanges(arr) {
  return (
    Array.isArray(arr) &&
    arr.length > 0 &&
    arr.every((g) => {
      if (!g || typeof g !== 'object') return false;

      const hasLower = g.lowerBound != null || g.lower != null || g.min != null;
      const hasUpper = g.upperBound != null || g.upper != null || g.max != null;
      const hasColor = g.color != null;

      // ranges generally DO NOT have countries arrays
      const hasCountriesArray = Array.isArray(g.countries);

      return hasLower && hasUpper && hasColor && !hasCountriesArray;
    })
  );
}

function looksLikeCategoricalGroups(arr) {
  return (
    Array.isArray(arr) &&
    arr.length > 0 &&
    arr.some((g) => g && typeof g === 'object' && Array.isArray(g.countries) && g.countries.length > 0)
  );
}

// Normalize ONE map row from DB into a stable API payload for thumbnails
function normalizeMapPayload(m) {
  if (!m) return null;

  let groups = m.groups ?? [];
  let custom_ranges = m.custom_ranges ?? [];

  // If custom_ranges missing but groups contain range objects, move them
  if ((!Array.isArray(custom_ranges) || custom_ranges.length === 0) && looksLikeRanges(groups)) {
    custom_ranges = groups;
    groups = [];
  }

  // Determine type
  const map_data_type =
    m.map_data_type ??
    m.mapDataType ??
    m.map_type ??
    m.type ??
    (Array.isArray(custom_ranges) && custom_ranges.length
      ? 'choropleth'
      : looksLikeCategoricalGroups(groups)
      ? 'categorical'
      : 'categorical');

  // Ensure arrays for safety
  if (!Array.isArray(groups)) groups = [];
  if (!Array.isArray(custom_ranges)) custom_ranges = [];

  return {
    id: m.id,
    title: m.title,
    selected_map: m.selected_map,
    ocean_color: m.ocean_color,
    unassigned_color: m.unassigned_color,
    font_color: m.font_color,
    is_title_hidden: m.is_title_hidden,

    // ✅ critical for correct coloring
    groups,
    custom_ranges,
    map_data_type,

    data: m.data,
    save_count: m.save_count,
    created_at: m.created_at,
    show_no_data_legend: m.show_no_data_legend,
    title_font_size: m.title_font_size,
    legend_font_size: m.legend_font_size,

    // keep your frontend compat fields too (harmless)
    titleFontSize: m.title_font_size,
    legendFontSize: m.legend_font_size,
  };
}

// Reusable map select for activity payloads
const MAP_SELECT = `
  id,
  title,
  selected_map,
  ocean_color,
  unassigned_color,
  font_color,
  is_title_hidden,
  groups,
  custom_ranges,
  map_data_type,
  data,
  save_count,
  created_at,
  show_no_data_legend,
  title_font_size,
  legend_font_size
`;

/* --------------------------------------------
   GET /api/activity/profile/:username
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

    // 2a) “Created” maps by this user (public only)
    const { data: createdMaps, error: createdErr } = await supabaseAdmin
      .from('maps')
      .select(MAP_SELECT)
      .eq('user_id', user_id)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(1000);

    if (createdErr) {
      console.error(createdErr);
      return res.status(500).json({ msg: 'Error fetching created maps' });
    }

    const createdActivities = (createdMaps || []).map((m) => ({
      type: 'createdMap',
      created_at: m.created_at,
      map: normalizeMapPayload(m),
      commentContent: null,
    }));

    // 2b) “Starred” maps => from map_saves (only public maps)
    const { data: starredRows, error: starredErr } = await supabaseAdmin
      .from('map_saves')
      .select(
        `
        created_at,
        map_id,
        Map:maps(
          ${MAP_SELECT},
          is_public
        )
      `
      )
      .eq('user_id', user_id)
      .eq('Map.is_public', true)
      .order('created_at', { ascending: false })
      .limit(1000);

    if (starredErr) {
      console.error(starredErr);
      return res.status(500).json({ msg: 'Error fetching starred maps' });
    }

    const starredActivities = (starredRows || []).map((save) => ({
      type: 'starredMap',
      created_at: save.created_at,
      map: normalizeMapPayload(save.Map),
      commentContent: null,
    }));

    // 2c) “Commented” => user posted comments (visible) on public maps
    const { data: userComments, error: commentErr } = await supabaseAdmin
      .from('comments')
      .select(
        `
        id,
        content,
        created_at,
        status,
        Map:maps(
          ${MAP_SELECT},
          is_public
        ),
        User:users(id, username, profile_picture)
      `
      )
      .eq('user_id', user_id)
      .eq('status', 'visible')
      .eq('Map.is_public', true)
      .order('created_at', { ascending: false })
      .limit(1000);

    if (commentErr) {
      console.error(commentErr);
      return res.status(500).json({ msg: 'Error fetching comments' });
    }

    const commentedActivities = (userComments || []).map((c) => ({
      type: 'commented',
      created_at: c.created_at,
      commentContent: c.content,
      commentAuthor: c.User
        ? {
            id: c.User.id,
            username: c.User.username,
            profile_picture: c.User.profile_picture,
          }
        : null,
      map: normalizeMapPayload(c.Map),
    }));

    // Combine, sort, paginate
    let allActivities = [...createdActivities, ...starredActivities, ...commentedActivities];
    allActivities.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const paginated = allActivities.slice(offset, offset + limit);

    return res.json(paginated);
  } catch (err) {
    console.error('Error in GET /api/activity/profile/:username:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

/* --------------------------------------------
   GET /api/activity/dashboard (Requires auth)
-------------------------------------------- */
router.get('/dashboard', auth, async (req, res) => {
  const user_id = req.user.id;

  const offset = parseInt(req.query.offset, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || 30;

  try {
    // ---------------------------------------------
    // (A) User's own created maps
    // ---------------------------------------------
    const { data: createdMaps, error: createdErr } = await supabaseAdmin
      .from('maps')
      .select(MAP_SELECT)
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (createdErr) {
      console.error(createdErr);
      return res.status(500).json({ msg: 'Error fetching created maps' });
    }

    const createdActivities = (createdMaps || []).map((m) => ({
      type: 'createdMap',
      created_at: m.created_at,
      map: normalizeMapPayload(m),
      commentContent: null,
    }));

    // ---------------------------------------------
    // (B) User's own starred maps
    // ---------------------------------------------
    const { data: starredRows, error: starredErr } = await supabaseAdmin
      .from('map_saves')
      .select(
        `
        created_at,
        map_id,
        Map:maps(${MAP_SELECT})
      `
      )
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (starredErr) {
      console.error(starredErr);
      return res.status(500).json({ msg: 'Error fetching starred maps' });
    }

    const starredActivities = (starredRows || []).map((save) => ({
      type: 'starredMap',
      created_at: save.created_at,
      map: normalizeMapPayload(save.Map),
      commentContent: null,
    }));

    // ---------------------------------------------
    // (C) User’s own commented maps
    // ---------------------------------------------
    const { data: userComments, error: commentErr } = await supabaseAdmin
      .from('comments')
      .select(
        `
        id,
        content,
        created_at,
        status,
        user_id,
        Map:maps(${MAP_SELECT}),
        User:users(
          id,
          username,
          profile_picture
        )
      `
      )
      .eq('user_id', user_id)
      .eq('status', 'visible')
      .order('created_at', { ascending: false });

    if (commentErr) {
      console.error(commentErr);
      return res.status(500).json({ msg: 'Error fetching comments' });
    }

    const commentedActivities = (userComments || []).map((c) => ({
      type: 'commented',
      created_at: c.created_at,
      commentContent: c.content,
      commentAuthor: c.User
        ? {
            id: c.User.id,
            username: c.User.username,
            profile_picture: c.User.profile_picture,
          }
        : null,
      map: normalizeMapPayload(c.Map),
    }));

    // Combine user's own activity
    let userActivity = [...createdActivities, ...starredActivities, ...commentedActivities];

    // ---------------------------------------------
    // (D) Notifications (other users starring/commenting on my maps)
    // ---------------------------------------------
    const { data: allNotifs, error: notiErr } = await supabaseAdmin
      .from('notifications')
      .select(
        `
        id,
        type,
        user_id,
        sender_id,
        map_id,
        comment_id,
        created_at,
        is_read
      `
      )
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (notiErr) {
      console.error('Error fetching notifications:', notiErr);
      return res.status(500).json({ msg: 'Server error' });
    }

    const notifications = allNotifs || [];

    // Gather IDs for batch fetching
    const senderIds = [];
    const mapIds = [];
    const commentIds = [];

    for (const n of notifications) {
      if (n.sender_id && !senderIds.includes(n.sender_id)) senderIds.push(n.sender_id);
      if (n.map_id && !mapIds.includes(n.map_id)) mapIds.push(n.map_id);
      if (n.comment_id && !commentIds.includes(n.comment_id)) commentIds.push(n.comment_id);
    }

    // (D1) Fetch sender info
    let sendersById = {};
    if (senderIds.length > 0) {
      const { data: senders, error: sendersErr } = await supabaseAdmin
        .from('users')
        .select(
          `
          id,
          username,
          first_name,
          last_name,
          profile_picture,
          status,
          profile_visibility,
          star_notifications
        `
        )
        .in('id', senderIds);

      if (sendersErr) {
        console.error(sendersErr);
        return res.status(500).json({ msg: 'Error fetching senders' });
      }

      (senders || []).forEach((s) => {
        sendersById[s.id] = s;
      });
    }

    // (D2) Fetch maps for notifications
    let mapsById = {};
    if (mapIds.length > 0) {
      const { data: fetchedMaps, error: mapsErr } = await supabaseAdmin
        .from('maps')
        .select(MAP_SELECT)
        .in('id', mapIds);

      if (mapsErr) {
        console.error(mapsErr);
        return res.status(500).json({ msg: 'Error fetching maps for notifications' });
      }

      (fetchedMaps || []).forEach((m) => {
        mapsById[m.id] = m;
      });
    }

    // (D3) Fetch comments for notifications
    let commentsById = {};
    if (commentIds.length > 0) {
      const { data: fetchedComments, error: commentsErr } = await supabaseAdmin
        .from('comments')
        .select(
          `
          id,
          content,
          status,
          user_id,
          User:users(
            id,
            username,
            profile_picture
          )
        `
        )
        .in('id', commentIds)
        .eq('status', 'visible');

      if (commentsErr) {
        console.error(commentsErr);
        return res.status(500).json({ msg: 'Error fetching comments for notifications' });
      }

      (fetchedComments || []).forEach((c) => {
        commentsById[c.id] = c;
      });
    }

    // (D4) Build notifActivities
    let notifActivities = [];

    for (const n of notifications) {
      const sender = n.sender_id ? sendersById[n.sender_id] || null : null;
      const mapObj = n.map_id ? mapsById[n.map_id] || null : null;
      const commentObj = n.comment_id ? commentsById[n.comment_id] || null : null;

      // respect sender opt-out for star notifications
      if ((n.type === 'star' || n.type === 'map_star') && sender && sender.star_notifications === false) {
        continue;
      }

      const commentAuthorData =
        commentObj && commentObj.User
          ? {
              id: commentObj.User.id,
              username: commentObj.User.username,
              profile_picture: commentObj.User.profile_picture,
            }
          : null;

      notifActivities.push({
        type: `notification_${n.type}`,
        created_at: n.created_at,
        map: normalizeMapPayload(mapObj),
        commentContent: commentObj ? commentObj.content : null,
        commentAuthor: commentAuthorData,
        notificationData: {
          id: n.id,
          is_read: n.is_read,
          sender,
        },
      });
    }

    // (E) Merge + sort + paginate
    let allActivities = [...userActivity, ...notifActivities];
    allActivities.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const paginated = allActivities.slice(offset, offset + limit);

    return res.json(paginated);
  } catch (err) {
    console.error('Error in GET /api/activity/dashboard:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
