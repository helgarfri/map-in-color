const express = require('express');
const router = express.Router();

const { supabaseAdmin } = require('../config/supabase'); // Use service_role key
const auth = require('../middleware/auth');
const authOptional = require('../middleware/authOptional');

/* --------------------------------------------
   GET /api/maps
   Fetch all maps for the logged-in user
-------------------------------------------- */
router.get('/', auth, async (req, res) => {
  try {
    const user_id = req.user.id;

    // Query "maps" where "user_id" = user_id
    const { data: userMaps, error } = await supabaseAdmin
      .from('maps')
      .select('*')
      .eq('user_id', user_id);

    if (error) {
      console.error('Error fetching maps:', error);
      return res.status(500).json({ msg: 'Server error' });
    }

    res.json(userMaps);
  } catch (err) {
    console.error('Error fetching maps:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

/* --------------------------------------------
   POST /api/maps
   Create a new map
-------------------------------------------- */
router.post('/', auth, async (req, res) => {
  try {
    const user_id = req.user.id;
    const mapData = { ...req.body };

    // If "tags" is an array, normalize to lowercase
    if (Array.isArray(mapData.tags)) {
      mapData.tags = mapData.tags.map((tag) => tag.toLowerCase());
    }

    // Insert into "maps"
    const { data: insertedMaps, error } = await supabaseAdmin
      .from('maps')
      .insert([
        {
          ...mapData,
          user_id: user_id,
          created_at: new Date().toISOString(), // Add this line
          updated_at: new Date().toISOString()  // Optional but recommended
        },
      ])
      .single(); // single => returns just the newly inserted row

    if (error) {
      console.error('Error creating map:', error);
      return res.status(500).json({ msg: 'Server error' });
    }

    const newMap = insertedMaps;

    // Also insert an "Activity" if desired
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
   Fetch saved maps for the logged-in user
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

    // Step 2) fetch the actual maps
    const { data: savedMaps, error: mapsErr } = await supabaseAdmin
      .from('maps')
      .select(`
        *,
        users!maps_user_id_fkey (
          username
        )
      `)
      .in('id', mapIds);

    if (mapsErr) {
      console.error('Error fetching saved map details:', mapsErr);
      return res.status(500).json({ msg: 'Server error' });
    }

    res.json(savedMaps);
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
    const mapId = req.params.id;
    const user_id = req.user?.id || null;

    // 1) fetch the map
    const { data: mapRow, error: mapErr } = await supabaseAdmin
      .from('maps')
      .select('*')
      .eq('id', mapId)
      .maybeSingle();

    if (mapErr) {
      console.error(mapErr);
      return res.status(500).json({ msg: 'Server error' });
    }
    if (!mapRow) {
      return res.status(404).json({ msg: 'Map not found' });
    }

    // Check if it's public or if user is owner
    if (!mapRow.is_public && (!user_id || mapRow.user_id !== user_id)) {
      return res.status(404).json({ msg: 'Map not found' });
    }

    const newDownloadCount = (mapRow.download_count || 0) + 1;
    // 2) update the map
    const { error: updateErr } = await supabaseAdmin
      .from('maps')
      .update({ download_count: newDownloadCount })
      .eq('id', mapId);

    if (updateErr) {
      console.error(updateErr);
      return res
        .status(500)
        .json({ msg: 'Error incrementing download count' });
    }

    console.log('DownloadCount AFTER increment:', newDownloadCount);

    res.json({ download_count: newDownloadCount });
  } catch (err) {
    console.error('Error incrementing download count:', err);
    res.status(500).json({ msg: 'Server error' });
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
    const updateData = { ...req.body };

    // If tags is an array, normalize
    if (Array.isArray(updateData.tags)) {
      updateData.tags = updateData.tags.map((t) => t.toLowerCase());
    }

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

    // 2) update the row
    const { data: updatedMap, error: updateErr } = await supabaseAdmin
      .from('maps')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()  // Add this
      })
      .eq('id', mapId)
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
   Delete a map (owner only)
-------------------------------------------- */
router.delete('/:id', auth, async (req, res) => {
  try {
    const mapId = req.params.id;
    const user_id = req.user.id;

    // 1) check ownership
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

    // 2) delete
    const { error: delErr } = await supabaseAdmin
      .from('maps')
      .delete()
      .eq('id', mapId);

    if (delErr) {
      console.error(delErr);
      return res.status(500).json({ msg: 'Error deleting map' });
    }

    res.json({ msg: 'Map deleted' });
  } catch (err) {
    console.error('Error deleting map:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

/* --------------------------------------------
   GET /api/maps/:id
   Fetch single map by ID
   (public or owner only)
-------------------------------------------- */
router.get('/:id', authOptional, async (req, res) => {
  try {
    const mapId = req.params.id;
    const user_id = req.user?.id || null;

    // If you want to embed the map's owner (User) data, reference the correct relationship
    const { data: mapRow, error } = await supabaseAdmin
      .from('maps')
      .select(
        `*,
         user:users!maps_user_id_fkey (
            id,
            username,
            first_name,
            last_name,
            profile_picture
         )`
      )
      .eq('id', mapId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching map:', error);
      return res.status(500).json({ msg: 'Server error' });
    }
    if (!mapRow) {
      return res.status(404).json({ msg: 'Map not found' });
    }

    // If not public and not owner
    if (!mapRow.is_public && (!user_id || mapRow.user_id !== user_id)) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    // Check if current user has saved it
    let isSavedByCurrentUser = false;
    let isOwner = false;

    if (user_id) {
      isOwner = mapRow.user_id === user_id;
      // check if there's a row in "map_saves"
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

    res.json(mapRow);
  } catch (err) {
    console.error('Error fetching map:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

/* --------------------------------------------
   POST /api/maps/:id/save
   "Star" a map
-------------------------------------------- */
/* --------------------------------------------
   POST /api/maps/:id/save
   "Star" a map
-------------------------------------------- */
router.post('/:id/save', auth, async (req, res) => {
  try {
    const mapId = req.params.id;
    const user_id = req.user.id;

    // 1) fetch the map
    const { data: mapRow } = await supabaseAdmin
      .from('maps')
      .select('*')
      .eq('id', mapId)
      .maybeSingle();

    if (!mapRow) {
      return res.status(404).json({ msg: 'Map not found' });
    }
    // if the map is private and not the owner, fail
    if (!mapRow.is_public && mapRow.user_id !== user_id) {
      return res.status(404).json({ msg: 'Map not found or private' });
    }

    // 2) check if MapSaves row already exists
    const { data: existingSave } = await supabaseAdmin
      .from('map_saves')
      .select('*')
      .eq('map_id', mapRow.id)
      .eq('user_id', user_id)
      .maybeSingle();

    if (existingSave) {
      return res.status(200).json({ msg: 'Map already saved' });
    }

    // 3) create row in map_saves
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

    // 4) increment the map's save_count
    const newSaveCount = (mapRow.save_count || 0) + 1;
    await supabaseAdmin
      .from('maps')
      .update({ save_count: newSaveCount })
      .eq('id', mapRow.id);

    // 5) record Activity (optional)
    await supabaseAdmin.from('activities').insert([
      {
        type: 'starred_map',
        user_id: user_id,
        mapTitle: mapRow.title,
        created_at: new Date(),
      },
    ]);

    // 6) create the star Notification if I'm not the owner
    if (mapRow.user_id !== user_id) {
      await supabaseAdmin.from('notifications').insert([
        {
          type: 'star',          // <--- "star"
          user_id: mapRow.user_id, // the map owner
          sender_id: user_id,      // me (the one who starred)
          map_id: mapRow.id,       // reference the map
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
    }

    // done
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

    // fetch the map
    const { data: mapRow } = await supabaseAdmin
      .from('maps')
      .select('*')
      .eq('id', mapId)
      .maybeSingle();

    if (!mapRow) {
      return res.status(404).json({ msg: 'Map not found' });
    }
    if (!mapRow.is_public && mapRow.user_id !== user_id) {
      return res.status(404).json({ msg: 'Map not found' });
    }

    // remove row from MapSaves
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
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;

       // 1) Check the user’s status
       const { data: userRow, error: userErr } = await supabaseAdmin
         .from('users')
         .select('id, status')
         .eq('id', user_id)
         .maybeSingle();
       if (userErr) {
         console.error('Error fetching user:', userErr);
         return res.status(500).json({ message: 'Server error (user fetch)' });
       }
       if (!userRow) {
         return res.status(404).json({ message: 'User not found' });
       }
       // If user is banned => hide their maps
       if (userRow.status === 'banned') {
         return res.json([]); 
         // or res.status(404).json({ msg: 'User not found' });
       }
    
        // 2) If not banned => fetch their public maps
        const { data: userMaps, error } = await supabaseAdmin
          .from('maps')
          .select('*')
          .eq('user_id', user_id)
          .eq('is_public', true)
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);
    
        if (error) {
          console.error(error);
          return res.status(500).json({ message: 'Server error' });
        }
    
        res.json(userMaps);
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
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;

    // Confirm the user in "users"
    const { data: userRow } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', user_id)
      .maybeSingle();

    if (!userRow) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // get "map_saves" for that user
    const { data: saves } = await supabaseAdmin
      .from('map_saves')
      .select('*')
      .eq('user_id', user_id);

    if (!saves || saves.length === 0) {
      return res.json([]); // no saved maps
    }

    const mapIds = saves.map((s) => s.map_id);

    // fetch only public maps
    const { data: starredMaps, error } = await supabaseAdmin
      .from('maps')
      .select('*')
      .in('id', mapIds)
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching starred maps:', error);
      return res.status(500).json({ message: 'Server error' });
    }

    // implement offset/limit in memory
    const paginated = starredMaps.slice(offset, offset + limit);

    res.json(paginated);
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

    // fetch all maps from that user
    const { data: userMaps, error } = await supabaseAdmin
      .from('maps')
      .select('save_count')
      .eq('user_id', user_id);

    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }

    const totalMaps = userMaps.length;
    const totalStars = userMaps.reduce((sum, m) => sum + (m.save_count || 0), 0);

    res.json({ totalMaps, totalStars });
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
      .select('*')
      .eq('user_id', user_id)
      .order('save_count', { ascending: false })
      .limit(1);

    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }

    const mostStarredMap = topMaps.length > 0 ? topMaps[0] : null;
    res.json(mostStarredMap);
  } catch (err) {
    console.error('Error fetching most starred map:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
