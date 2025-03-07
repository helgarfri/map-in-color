// routes/explore.js
const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');

// MAIN /explore route (paged) ...
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
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 24;

    const tagsArray = tags
      ? tags.split(',').map((t) => t.trim().toLowerCase())
      : [];

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
      `, { count: 'exact' })
      .eq('is_public', true);

    // Searching?
    if (search) {
      baseQuery = baseQuery.ilike('title', `%${search}%`);
    }

    // Filtering by AND of all tags
    if (tagsArray.length > 0) {
      baseQuery = baseQuery.contains('tags', tagsArray);
    }

    // Sorting
    if (sort === 'newest') {
      baseQuery = baseQuery.order('created_at', { ascending: false });
    } else if (sort === 'starred' || sort === 'trending') {
      baseQuery = baseQuery.order('save_count', { ascending: false });
    } else {
      baseQuery = baseQuery.order('created_at', { ascending: false });
    }

    // Pagination
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum - 1;
    baseQuery = baseQuery.range(startIndex, endIndex);

    const { data: maps, count, error } = await baseQuery;
    if (error) {
      console.error('Error in /explore route (Supabase):', error);
      return res.status(500).json({ message: 'Server error' });
    }

    // Return slice plus total
    return res.json({ maps, total: count || 0 });
  } catch (err) {
    console.error('Error in /explore route:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// /explore/tags => returns top 50 by frequency
router.get('/tags', async (req, res) => {
  try {
    // Select tags from all public maps
    const { data, error } = await supabaseAdmin
      .from('maps')
      .select('tags')
      .eq('is_public', true);

    if (error) {
      console.error('Error in /explore/tags route:', error);
      return res.status(500).json({ message: 'Server error' });
    }

    // Build an object: { tagName: count }
    const tagCounts = {};
    data.forEach((row) => {
      if (Array.isArray(row.tags)) {
        row.tags.forEach((tag) => {
          const lower = tag.toLowerCase();
          if (!tagCounts[lower]) tagCounts[lower] = 0;
          tagCounts[lower]++;
        });
      }
    });

    // Convert => array of { tag, count }, sort descending by count
    let results = Object.entries(tagCounts).map(([tag, count]) => ({
      tag,
      count,
    }));
    results.sort((a, b) => b.count - a.count);

    // Slice to top 50
    results = results.slice(0, 56);

    return res.json(results);
  } catch (err) {
    console.error('Error in /explore/tags route:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
