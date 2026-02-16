const express = require('express');
const router = express.Router();

const { supabaseAdmin } = require('../config/supabase'); // Use service_role key
const auth = require('../middleware/auth');
const authOptional = require('../middleware/authOptional');

//helper
function stripEmptyUpdateFields(obj) {
  const clean = { ...obj };

  // remove undefined / null
  Object.keys(clean).forEach((k) => {
    if (clean[k] === undefined || clean[k] === null) delete clean[k];
  });

  // IMPORTANT: don't overwrite stored arrays with empty arrays
  // (MapDetail often sends [] by default)
  if (Array.isArray(clean.custom_ranges) && clean.custom_ranges.length === 0) {
    delete clean.custom_ranges;
  }
  if (Array.isArray(clean.groups) && clean.groups.length === 0) {
    delete clean.groups;
  }
  if (Array.isArray(clean.data) && clean.data.length === 0) {
    delete clean.data;
  }

  return clean;
}

/** Attach comment_count to each map (visible comments only). Mutates the array. */
async function attachCommentCounts(maps) {
  if (!maps || maps.length === 0) return maps;
  const mapIds = maps.map((m) => m.id);
  const { data: commentRows, error } = await supabaseAdmin
    .from('comments')
    .select('map_id')
    .in('map_id', mapIds)
    .eq('status', 'visible');
  const countByMap = {};
  mapIds.forEach((id) => (countByMap[id] = 0));
  if (!error && commentRows && commentRows.length > 0) {
    commentRows.forEach((row) => {
      countByMap[row.map_id] = (countByMap[row.map_id] || 0) + 1;
    });
  }
  maps.forEach((m) => (m.comment_count = countByMap[m.id] ?? 0));
  return maps;
}

/* --------------------------------------------
   GET /api/maps
   Fetch all maps for the logged-in user
   (owner’s private route)
-------------------------------------------- */
router.get('/', auth, async (req, res) => {
  try {
    const user_id = req.user.id;

    // These are the user's own maps, so it's OK to skip "banned" checks 
    // because a banned user presumably can't log in anyway, or you can check if user is banned in your auth middleware
    const { data: userMaps, error } = await supabaseAdmin
      .from('maps')
      .select('*')
      .eq('user_id', user_id);

    if (error) {
      console.error('Error fetching maps:', error);
      return res.status(500).json({ msg: 'Server error' });
    }

    await attachCommentCounts(userMaps || []);
    res.json(userMaps);
  } catch (err) {
    console.error('Error fetching maps:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

/* --------------------------------------------
   POST /api/maps
   Create a new map
   (owner route)
-------------------------------------------- */
router.post('/', auth, async (req, res) => {
  try {
    const user_id = req.user.id;
     // Destructure titleFontSize and legendFontSize from req.body
     const { titleFontSize, legendFontSize, ...mapData } = req.body;



    // If "tags" is an array, normalize to lowercase
    if (Array.isArray(mapData.tags)) {
      mapData.tags = mapData.tags.map((tag) => tag.toLowerCase());
    }

  
    // Insert into "maps" (IMPORTANT: use .select() so Supabase returns the inserted row)
    const { data: newMap, error } = await supabaseAdmin
      .from('maps')
      .insert({
        ...mapData,
        title_font_size: titleFontSize,
        legend_font_size: legendFontSize,
        user_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error creating map:', error);
      return res.status(500).json({ msg: 'Server error' });
    }


    // (optional) Insert an "Activity" row
    await supabaseAdmin.from('activities').insert([
      {
        type: 'createdMap',
        user_id: user_id,
        created_at: new Date(),
      },
    ]);

    res.json(newMap);
  } catch (err) {
    console.error('Error creating map:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

/* --------------------------------------------
   GET /api/maps/saved
   Fetch the current user's saved maps
-------------------------------------------- */
router.get('/saved', auth, async (req, res) => {
  try {
    const user_id = req.user.id;

    // Step 1) fetch all saves for user from "map_saves"
    const { data: saves, error: savesErr } = await supabaseAdmin
      .from('map_saves')
      .select('*')
      .eq('user_id', user_id);

    if (savesErr) {
      console.error('Error fetching saved maps:', savesErr);
      return res.status(500).json({ msg: 'Server error' });
    }

    // Collect map_ids
    const mapIds = saves.map((s) => s.map_id);

    if (mapIds.length === 0) {
      return res.json([]); // user has no saved maps
    }

    // Step 2) fetch the actual maps + user (including status)
    const { data: savedMaps, error: mapsErr } = await supabaseAdmin
      .from('maps')
      .select(`
        *,
        user:users!maps_user_id_fkey (
          id,
          username,
          status,
          first_name,
          last_name,
          profile_picture
        )
      `)
      .in('id', mapIds);

    if (mapsErr) {
      console.error('Error fetching saved map details:', mapsErr);
      return res.status(500).json({ msg: 'Server error' });
    }

    // 2.5) Filter out if the map's owner is banned
    const filteredMaps = savedMaps.filter((m) => {
      if (!m.user) return false; // corrupted data or user missing
      return m.user.status !== 'banned';
    });

    await attachCommentCounts(filteredMaps);
    res.json(filteredMaps);
  } catch (err) {
    console.error('Error fetching saved maps:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

/* --------------------------------------------
   POST /api/maps/:id/download
   Increment download count (optional auth)
-------------------------------------------- */
router.post('/:id/download', authOptional, async (req, res) => {
  try {
    const mapId = Number(req.params.id); // ✅ coerce
    if (!Number.isFinite(mapId)) return res.status(400).json({ msg: "Invalid map id" });

    const user_id = req.user?.id ?? null;
    const anon_id = req.body?.anon_id ?? null;

    if (!user_id && !anon_id) {
      return res.status(400).json({ msg: "anon_id required for anonymous downloads" });
    }

    // fetch map
    const { data: mapRow, error: mapErr } = await supabaseAdmin
      .from('maps')
      .select(`
        id,
        user_id,
        is_public,
        download_count,
        user:users!maps_user_id_fkey ( id, status )
      `)
      .eq('id', mapId)
      .maybeSingle();

    if (mapErr) return res.status(500).json({ msg: 'Server error' });
    if (!mapRow) return res.status(404).json({ msg: 'Map not found' });
    if (mapRow.user?.status === 'banned') return res.status(404).json({ msg: 'Map not found' });

    if (!mapRow.is_public && (!user_id || mapRow.user_id !== user_id)) {
      return res.status(404).json({ msg: 'Map not found' });
    }

    const insertPayload = {
      map_id: mapRow.id,                 // bigint
      user_id: user_id,                  // must match your DB type
      anon_id: user_id ? null : anon_id, // only store anon_id if not logged in
      created_at: new Date().toISOString(),
    };

    const { error: insErr } = await supabaseAdmin
      .from('map_downloads')
      .insert(insertPayload); // ✅ can insert object directly

    if (insErr) {
      // ✅ best: check code 23505
      const isDuplicate = insErr.code === "23505" || String(insErr.message || "").toLowerCase().includes("duplicate");
      if (isDuplicate) {
        return res.json({ download_count: mapRow.download_count || 0, already_counted: true });
      }
      console.error("map_downloads insert error:", insErr);
      return res.status(500).json({ msg: "Error recording download" });
    }

    const newDownloadCount = (mapRow.download_count || 0) + 1;

    const { error: updateErr } = await supabaseAdmin
      .from('maps')
      .update({ download_count: newDownloadCount })
      .eq('id', mapRow.id);

    if (updateErr) {
      console.error(updateErr);
      return res.status(500).json({ msg: 'Error incrementing download count' });
    }

    return res.json({ download_count: newDownloadCount, already_counted: false });
  } catch (err) {
    console.error('Error incrementing download count:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});


/* --------------------------------------------
   PUT /api/maps/:id
   Update a map (owner only)
-------------------------------------------- */
router.put('/:id', auth, async (req, res) => {
  try {
    const mapId = req.params.id;
    const user_id = req.user.id;

    // Pull out the front-end fields
    const { titleFontSize, legendFontSize, ...restRaw } = req.body;

    // ✅ normalize tags on the actual object we will update
    if (Array.isArray(restRaw.tags)) {
      restRaw.tags = restRaw.tags.map((t) => t.toLowerCase());
    }

    // ✅ remove undefined/null and remove [] overwrites
    const rest = stripEmptyUpdateFields(restRaw);

    // 1) check if map belongs to this user
    const { data: existingMap } = await supabaseAdmin
      .from('maps')
      .select('*')
      .eq('id', mapId)
      .eq('user_id', user_id)
      .maybeSingle();

    if (!existingMap) {
      return res
        .status(404)
        .json({ msg: 'Map not found or you are not the owner' });
    }

    // 2) update
    const updatePayload = {
      ...rest,
      updated_at: new Date().toISOString(),
    };

    // only set font sizes if they were actually sent
    if (titleFontSize !== undefined) updatePayload.title_font_size = titleFontSize;
    if (legendFontSize !== undefined) updatePayload.legend_font_size = legendFontSize;

    const { data: updatedMap, error: updateErr } = await supabaseAdmin
      .from('maps')
      .update(updatePayload)
      .eq('id', mapId)
      .select('*')
      .single();

    if (updateErr) {
      console.error(updateErr);
      return res.status(500).json({ msg: 'Error updating map' });
    }

    res.json(updatedMap);
  } catch (err) {
    console.error('Error updating map:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});


/* --------------------------------------------
   DELETE /api/maps/:id
   Delete a map (owner only),
   AND remove references in other tables.
-------------------------------------------- */
router.delete('/:id', auth, async (req, res) => {
  try {
    const mapId = req.params.id;
    const user_id = req.user.id;

    // 1) Check ownership
    const { data: existingMap, error: findErr } = await supabaseAdmin
      .from('maps')
      .select('*')
      .eq('id', mapId)
      .eq('user_id', user_id)
      .maybeSingle();

    if (findErr) {
      console.error(findErr);
      return res.status(500).json({ msg: 'Server error fetching map' });
    }
    if (!existingMap) {
      return res.status(404).json({ msg: 'Map not found or you are not the owner' });
    }

    // 2) Remove references from notifications that mention this map
    const { error: notifErr } = await supabaseAdmin
      .from('notifications')
      .delete()
      .eq('map_id', mapId);

    if (notifErr) {
      console.error('Error removing notifications for map:', notifErr);
      // Not fatal; continue
    }

    // 3) Remove saves for this map
    const { error: savesErr } = await supabaseAdmin
      .from('map_saves')
      .delete()
      .eq('map_id', mapId);

    if (savesErr) {
      console.error('Error removing map_saves for map:', savesErr);
      // Not fatal; continue
    }

    // 4) Remove comments referencing this map
    //    Either fully delete them, or just set "status" = "hidden"
    const { error: commentsErr } = await supabaseAdmin
      .from('comments')
      .delete()
      .eq('map_id', mapId);

    if (commentsErr) {
      console.error('Error removing comments for map:', commentsErr);
      // Not fatal; continue
    }

    // 5) Optionally remove the 'createdMap' Activity row for this map
    //    If you store it in a "activities" table, remove it:
    const { error: activityErr } = await supabaseAdmin
      .from('activities')
      .delete()
      .eq('type', 'createdMap')
      .eq('user_id', user_id)
      // If you store the map_id, you can eq('map_id', mapId).
      // or if you store "mapTitle", you can eq('mapTitle', existingMap.title)
      // depends how you originally inserted it
      ;

    if (activityErr) {
      console.error('Error removing createdMap Activity:', activityErr);
      // Not fatal; continue
    }

    // 6) Finally, remove the map itself
    const { error: delErr } = await supabaseAdmin
      .from('maps')
      .delete()
      .eq('id', mapId);

    if (delErr) {
      console.error(delErr);
      return res.status(500).json({ msg: 'Error deleting map' });
    }

    res.json({ msg: 'Map deleted successfully (and references removed)' });
  } catch (err) {
    console.error('Error deleting map:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

/* --------------------------------------------
   GET /api/maps/:id
   Fetch single map by ID (public or owner only)
-------------------------------------------- */
router.get('/:id', authOptional, async (req, res) => {
  try {
    const mapId = req.params.id;
    const user_id = req.user?.id || null;

    // join with user (including status)
    const { data: mapRow, error } = await supabaseAdmin
      .from('maps')
      .select(`
        *,
        user:users!maps_user_id_fkey (
          id,
          username,
          first_name,
          last_name,
          profile_picture,
          status
        )
      `)
      .eq('id', mapId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching map:', error);
      return res.status(500).json({ msg: 'Server error' });
    }
    if (!mapRow) {
      return res.status(404).json({ msg: 'Map not found' });
    }

    // If the owner is banned => hide
    if (mapRow.user && mapRow.user.status === 'banned') {
      return res.status(404).json({ msg: 'Map not found' });
    }

    // If map is private and user is NOT the owner => Return partial data
    if (!mapRow.is_public && mapRow.user_id !== user_id) {
      return res.json({
        id: mapRow.id,
        user_id: mapRow.user_id,
        is_public: false,
        isOwner: false,

        // Add created_at so the front end won't break:
        created_at: mapRow.created_at,

        // Minimizing or hiding the real data is optional; do as you wish:
        title: mapRow.title || 'Private Map',
        description: '',
        data: [],
        user: {
          username: mapRow.user?.username || 'unknown',
          first_name: mapRow.user?.first_name || '',
          last_name: mapRow.user?.last_name || '',
          profile_picture: mapRow.user?.profile_picture || null,
        },
      });
    }

    // Otherwise, if it's public OR user is owner => return full data
    let isSavedByCurrentUser = false;
    let isOwner = false;

    if (user_id) {
      isOwner = mapRow.user_id === user_id;
      const { data: existingSave } = await supabaseAdmin
        .from('map_saves')
        .select('*')
        .eq('map_id', mapRow.id)
        .eq('user_id', user_id)
        .maybeSingle();
      isSavedByCurrentUser = !!existingSave;
    }

    mapRow.isSavedByCurrentUser = isSavedByCurrentUser;
    mapRow.isOwner = isOwner;

    return res.json(mapRow);
  } catch (err) {
    console.error('Error fetching map:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

/* --------------------------------------------
   POST /api/maps/:id/save
   "Star" a map
-------------------------------------------- */
router.post('/:id/save', auth, async (req, res) => {
  try {
    const mapId = req.params.id;
    const user_id = req.user.id;

    

    // fetch the map (join the user to see if user is banned)
    const { data: mapRow } = await supabaseAdmin
      .from('maps')
      .select(`
        *,
        user:users!maps_user_id_fkey (
          id,
          status
        )
      `)
      .eq('id', mapId)
      .maybeSingle();

    if (!mapRow) {
      return res.status(404).json({ msg: 'Map not found' });
    }
    // If the owner is banned => hide
    if (mapRow.user && mapRow.user.status === 'banned') {
      return res.status(404).json({ msg: 'Map not found' });
    }

    // if the map is private and not the owner, fail
    if (!mapRow.is_public && mapRow.user_id !== user_id) {
      return res.status(404).json({ msg: 'Map not found or private' });
    }

    // check if MapSaves row already exists
    const { data: existingSave } = await supabaseAdmin
      .from('map_saves')
      .select('*')
      .eq('map_id', mapRow.id)
      .eq('user_id', user_id)
      .maybeSingle();

    if (existingSave) {
      return res.status(200).json({ msg: 'Map already saved' });
    }

    // create row in map_saves
    const { error: saveErr } = await supabaseAdmin
      .from('map_saves')
      .insert([
        {
          map_id: mapRow.id,
          user_id: user_id,


          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

    if (saveErr) {
      console.error(saveErr);
      return res.status(500).json({ msg: 'Error saving map' });
    }

    // increment the map's save_count
    const newSaveCount = (mapRow.save_count || 0) + 1;
    await supabaseAdmin
      .from('maps')
      .update({ save_count: newSaveCount })
      .eq('id', mapRow.id);

    // -----------------------------------------------------------
    // INSERT THE "star" NOTIFICATION (if starring someone else's map)
    // -----------------------------------------------------------
    // user_id: who *receives* the notification (map owner)
    // sender_id: who *performed* the action (the star)
    // map_id: reference to which map
    // type: 'star'
    // is_read: false by default

    if (mapRow.user_id !== user_id) {
      const { error: notifErr } = await supabaseAdmin
        .from('notifications')
        .insert({
          user_id: mapRow.user_id,   // map's owner gets the notification
          sender_id: user_id,        // the user who just starred it
          map_id: mapRow.id,
          type: 'star',
          is_read: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),

        });
      if (notifErr) {
        console.error('Error inserting star notification:', notifErr);
        // We'll still return success, or you can handle it differently
      }
    }

    res.json({ msg: 'Map saved' });
  } catch (err) {
    console.error('Error saving map:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

/* --------------------------------------------
   POST /api/maps/:id/unsave
   "Un-star" a map
-------------------------------------------- */
router.post('/:id/unsave', auth, async (req, res) => {
  try {
    const mapId = req.params.id;
    const user_id = req.user.id;

    // fetch the map (including user)
    const { data: mapRow } = await supabaseAdmin
      .from('maps')
      .select(`
        *,
        user:users!maps_user_id_fkey(
          id,
          status
        )
      `)
      .eq('id', mapId)
      .maybeSingle();

    if (!mapRow) {
      return res.status(404).json({ msg: 'Map not found' });
    }

    // if the owner is banned => hide
    if (mapRow.user && mapRow.user.status === 'banned') {
      return res.status(404).json({ msg: 'Map not found' });
    }

    if (!mapRow.is_public && mapRow.user_id !== user_id) {
      return res.status(404).json({ msg: 'Map not found' });
    }

    // remove from map_saves
    const { error: delErr } = await supabaseAdmin
      .from('map_saves')
      .delete()
      .eq('map_id', mapRow.id)
      .eq('user_id', user_id);

    if (delErr) {
      console.error(delErr);
      return res.status(500).json({ msg: 'Error unsaving map' });
    }

    // decrement map.save_count
    const newSaveCount = Math.max(0, (mapRow.save_count || 0) - 1);
    await supabaseAdmin
      .from('maps')
      .update({ save_count: newSaveCount })
      .eq('id', mapRow.id);

    res.json({ msg: 'Map unsaved' });
  } catch (err) {
    console.error('Error unsaving map:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

/* --------------------------------------------
   GET /api/maps/user/:user_id
   Fetch public maps by user ID with pagination
-------------------------------------------- */
router.get('/user/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 24;
    const sort = req.query.sort || 'newest'; 
      // 'newest', 'oldest', 'mostStarred' etc.

    // 1) confirm user
    const { data: userRow, error: userErr } = await supabaseAdmin
      .from('users')
      .select('id, status')
      .eq('id', user_id)
      .maybeSingle();

    if (userErr) {
      console.error('Error fetching user:', userErr);
      return res.status(500).json({ message: 'Server error' });
    }
    if (!userRow) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (userRow.status === 'banned') {
      // If they’re banned, return empty
      return res.json({ maps: [], total: 0 });
    }

    // 2) build a base query with count: 'exact', no range yet
    let baseQuery = supabaseAdmin
      .from('maps')
      .select('*', { count: 'exact' })
      .eq('user_id', user_id)
      .eq('is_public', true);

    // 3) apply your sorting
    if (sort === 'oldest') {
      baseQuery = baseQuery.order('created_at', { ascending: true });
    } else if (sort === 'mostStarred') {
      baseQuery = baseQuery.order('save_count', { ascending: false });
    } else {
      // default newest
      baseQuery = baseQuery.order('created_at', { ascending: false });
    }

    // 4) run it
    const { data, count, error } = await baseQuery;
    if (error) {
      console.error('Error fetching user maps:', error);
      return res.status(500).json({ message: 'Server error' });
    }

    // 5) total is count
    const total = count || 0;

    // 6) do final slicing in memory
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const finalSlice = data.slice(startIndex, endIndex);

    return res.json({
      maps: finalSlice,
      total
    });
  } catch (err) {
    console.error('Error fetching maps:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* --------------------------------------------
   GET /api/maps/user/:user_id/starred
   Fetch starred maps by user ID (public only) 
   with pagination
-------------------------------------------- */
router.get('/user/:user_id/starred', async (req, res) => {
  try {
    const { user_id } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 24;
    const sort = req.query.sort || 'newest'; 

    // confirm user
    const { data: userRow, error: userErr } = await supabaseAdmin
      .from('users')
      .select('id, status')
      .eq('id', user_id)
      .maybeSingle();

    if (userErr) {
      console.error('Error:', userErr);
      return res.status(500).json({ message: 'Server error' });
    }
    if (!userRow) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (userRow.status === 'banned') {
      // If they’re banned, can just return empty
      return res.json({ maps: [], total: 0 });
    }

    // get map_saves for that user
    const { data: saves, error: savesErr } = await supabaseAdmin
      .from('map_saves')
      .select('*')
      .eq('user_id', user_id);

    if (savesErr) {
      console.error('Error fetching map_saves:', savesErr);
      return res.status(500).json({ message: 'Server error' });
    }
    if (!saves || saves.length === 0) {
      return res.json({ maps: [], total: 0 });
    }

    const mapIds = saves.map((s) => s.map_id);

    // 1) we want all those maps that are public
    // 2) we also want total. But supabase won't do `.in(...).select('*', { count: 'exact' })`
    //    and then a separate .range easily, so let's do it in memory again
    let baseQuery = supabaseAdmin
      .from('maps')
      .select(`
        *,
        user:users!maps_user_id_fkey (
          id,
          username,
          status
        )
      `, { count: 'exact' })
      .in('id', mapIds)
      .eq('is_public', true);

    // apply sorting
    if (sort === 'oldest') {
      baseQuery = baseQuery.order('created_at', { ascending: true });
    } else if (sort === 'mostStarred') {
      baseQuery = baseQuery.order('save_count', { ascending: false });
    } else {
      baseQuery = baseQuery.order('created_at', { ascending: false });
    }

    const { data: allStarred, count, error } = await baseQuery;
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }

    // filter out if the map’s owner is banned
    const filtered = (allStarred || []).filter((m) => {
      if (!m.user) return false;
      return m.user.status !== 'banned';
    });

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const finalSlice = filtered.slice(startIndex, endIndex);

    return res.json({
      maps: finalSlice,
      total
    });
  } catch (err) {
    console.error('Error fetching starred maps:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* --------------------------------------------
   GET /api/maps/user/:user_id/stats
   Get total maps and total stars for a user
-------------------------------------------- */
router.get('/user/:user_id/stats', async (req, res) => {
  try {
    const { user_id } = req.params;

    // Fetch is_public and save_count
    const { data: userMaps, error } = await supabaseAdmin
      .from('maps')
      .select('save_count, is_public')
      .eq('user_id', user_id);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ message: 'Server error' });
    }

    // totalMaps = all maps (public or private)
    const totalMaps = userMaps.length;

    // totalPublicMaps = only is_public === true
    const totalPublicMaps = userMaps.filter(m => m.is_public).length;

    // totalStars = sum of save_count
    const totalStars = userMaps.reduce((sum, m) => sum + (m.save_count || 0), 0);

    // Return all three
    res.json({
      totalMaps,
      totalPublicMaps,
      totalStars
    });
  } catch (err) {
    console.error('Error fetching user stats:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


/* --------------------------------------------
   GET /api/maps/user/:user_id/most-starred
   Get the user's map with the highest save_count
-------------------------------------------- */
router.get('/user/:user_id/most-starred', async (req, res) => {
  try {
    const { user_id } = req.params;

    const { data: topMaps, error } = await supabaseAdmin
      .from('maps')
      .select(`
        *,
        user:users!maps_user_id_fkey (
          id,
          status
        )
      `)
      .eq('user_id', user_id)
      .order('save_count', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error fetching most starred map:', error);
      return res.status(500).json({ message: 'Server error' });
    }

    if (!topMaps || topMaps.length === 0) {
      return res.json(null);
    }

    // if the user is banned => hide
    const topMap = topMaps[0];
    if (topMap.user && topMap.user.status === 'banned') {
      return res.json(null);
    }

    res.json(topMap);
  } catch (err) {
    console.error('Error fetching most starred map:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
