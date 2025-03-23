// routes/explore.js
const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');

/**
 * GET /api/explore
 * Allows query params:
 *   ?sort={newest|starred|trending}
 *   ?search=string
 *   ?tags=comma,separated,tags
 *   ?page=number
 *   ?limit=number
 * 
 * Returns: { maps, total }
 *   maps[] => after filtering out banned owners
 *   total => the total # of maps after filtering
 */
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

    // parse "tags" => ["tag1","tag2"]
    const tagsArray = tags
      ? tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean)
      : [];

    // 1) Build a base query that fetches *all* matching records (no Supabase range),
    //    so we can do the final filter & pagination in memory.
    //    We select the user relationship to get "status"
    let baseQuery = supabaseAdmin
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
      `, { count: 'exact' })  // we ask for total count
      .eq('is_public', true); // only public

    // 2) Searching in title?
    if (search) {
      baseQuery = baseQuery.ilike('title', `%${search}%`);
    }

    // 3) Tag filtering (maps.tags is an ARRAY in DB).
    //    If you want an AND match for all tags => .contains('tags', tagsArray)
    //    If you want an OR match => you'd do .overlaps('tags', tagsArray)
    if (tagsArray.length > 0) {
      baseQuery = baseQuery.contains('tags', tagsArray);
    }

    // 4) Sort (only partially accurate until we do final filter)
    //    We'll do a rough sort before final filter
    if (sort === 'starred' || sort === 'trending') {
      // e.g. sort by save_count desc
      baseQuery = baseQuery.order('save_count', { ascending: false });
    } else {
      // default newest => sort by created_at desc
      baseQuery = baseQuery.order('created_at', { ascending: false });
    }

    // 5) Execute the query WITHOUT range, so we can filter out banned owners
    //    and do final pagination in memory
    const { data: allMaps, count, error } = await baseQuery;
    if (error) {
      console.error('Error in /explore route (Supabase):', error);
      return res.status(500).json({ message: 'Server error' });
    }

    // 6) Filter out any map whose user is banned
    const filtered = (allMaps || []).filter((map) => {
      // If there's no user object, or the user is banned => exclude
      if (!map.user) return false;
      return map.user.status !== 'banned';
    });

    // Now the total # after filtering
    const total = filtered.length;

    // 7) Do final pagination in memory
    const pageIndex = pageNum - 1; // zero-based
    const startIndex = pageIndex * limitNum;
    const endIndex = startIndex + limitNum; // slice end is exclusive
    const finalSlice = filtered.slice(startIndex, endIndex);

    // Return
    return res.json({
      maps: finalSlice,
      total, // total after filtering
    });
  } catch (err) {
    console.error('Error in /explore route:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/explore/tags
 * Return top tags among public maps (and not from banned owners).
 */
router.get('/tags', async (req, res) => {
  try {
    // 1) fetch all public maps + user
    const { data, error } = await supabaseAdmin
      .from('maps')
      .select(`
        tags,
        user:users!maps_user_id_fkey (
          id,
          status
        )
      `)
      .eq('is_public', true);

    if (error) {
      console.error('Error in /explore/tags route:', error);
      return res.status(500).json({ message: 'Server error' });
    }

    // 2) filter out any map whose user is banned
    const visible = data.filter((row) => {
      if (!row.user) return false;
      return row.user.status !== 'banned';
    });

    // 3) gather tag frequency
    const tagCounts = {};
    visible.forEach((row) => {
      if (Array.isArray(row.tags)) {
        row.tags.forEach((tag) => {
          const lower = tag.toLowerCase();
          if (!tagCounts[lower]) tagCounts[lower] = 0;
          tagCounts[lower]++;
        });
      }
    });

    // 4) convert => array of {tag, count}, sort desc
    let results = Object.entries(tagCounts).map(([tag, count]) => ({
      tag,
      count,
    }));
    results.sort((a, b) => b.count - a.count);

    // 5) limit to top 50 or so
    results = results.slice(0, 1000);

    return res.json(results);
  } catch (err) {
    console.error('Error in /explore/tags route:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
