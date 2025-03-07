// routes/explore.js
const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');

router.get('/', async (req, res) => {
  try {
    let {
      sort = 'newest',
      search = '',
      tags = '',
      page = '1',
      limit = '24',
    } = req.query;

    search = search.trim();

    // parse page and limit to numbers
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 24;

    const tagsArray = tags
      ? tags.split(',').map((t) => t.trim().toLowerCase())
      : [];

    // Base query
    // Notice we do the .select(..., { count: 'exact' }) and .range(...) for pagination
    let baseQuery = supabaseAdmin
      .from('maps')
      .select(
        `
          *,
          user:users!maps_user_id_fkey (
            id,
            username,
            first_name,
            last_name,
            profile_picture
          )
        `,
        { count: 'exact' }
      )
      .eq('is_public', true);

    // Searching?
    if (search) {
      baseQuery = baseQuery.ilike('title', `%${search}%`);
    }

    // Filtering by tags?
    if (tagsArray.length > 0) {
      baseQuery = baseQuery.overlaps('tags', tagsArray);
    }

    // Sorting
    if (sort === 'newest') {
      baseQuery = baseQuery.order('created_at', { ascending: false });
    } else if (sort === 'starred' || sort === 'trending') {
      // For "trending," we’re just sorting by save_count as a placeholder
      baseQuery = baseQuery.order('save_count', { ascending: false });
    } else {
      // default to newest
      baseQuery = baseQuery.order('created_at', { ascending: false });
    }

    // Apply pagination:
    // range() is inclusive, so for page=1, limit=24 => 0..23
    // for page=2 => 24..47, etc.
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex   = pageNum * limitNum - 1;

    baseQuery = baseQuery.range(startIndex, endIndex);

    // Execute the query
    const { data: maps, count, error } = await baseQuery;

    if (error) {
      console.error('Error in /explore route (Supabase):', error);
      return res.status(500).json({ message: 'Server error' });
    }

    // Return the slice plus the total
    res.json({
      maps,
      total: count || 0
    });
  } catch (err) {
    console.error('Error in /explore route:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
