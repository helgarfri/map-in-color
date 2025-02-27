// routes/explore.js
const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');

router.get('/', async (req, res) => {
  try {
    let { sort = 'newest', search = '', tags = '' } = req.query;
    search = search.trim();

    const tagsArray = tags
      ? tags.split(',').map((t) => t.trim().toLowerCase())
      : [];

    // Use the relationship alias "users!maps_user_id_fkey" to embed the user who owns the map
    let baseQuery = supabaseAdmin
      .from('maps')
      .select(`
        *,
        user:users!maps_user_id_fkey (
          id,
          username,
          first_name,
          last_name,
          profile_picture
        )
      `)
      .eq('is_public', true)
      .limit(50);

    if (search) {
      baseQuery = baseQuery.ilike('title', `%${search}%`);
    }

    if (tagsArray.length > 0) {
      baseQuery = baseQuery.overlaps('tags', tagsArray);
    }

    if (sort === 'newest') {
      baseQuery = baseQuery.order('created_at', { ascending: false });
    } else if (sort === 'starred') {
      baseQuery = baseQuery.order('save_count', { ascending: false });
    } else if (sort === 'trending') {
      // Placeholder: sort by save_count for now
      baseQuery = baseQuery.order('save_count', { ascending: false });
    } else {
      baseQuery = baseQuery.order('created_at', { ascending: false });
    }

    const { data: maps, error } = await baseQuery;
    if (error) {
      console.error('Error in /explore route (Supabase):', error);
      return res.status(500).json({ message: 'Server error' });
    }

    res.json(maps);
  } catch (err) {
    console.error('Error in /explore route:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
