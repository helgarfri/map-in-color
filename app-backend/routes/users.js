// routes/users.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');

// Import the service_role client
const { supabaseAdmin } = require('../config/supabase');

/* --------------------------------------------
   DELETE /api/users/deleteAccount
-------------------------------------------- */
router.delete('/deleteAccount', auth, async (req, res) => {
  try {
    const user_id = req.user.id;

    // 1) Fetch user from "users"
    const { data: userRow, error: userErr } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', user_id)
      .maybeSingle();

    if (userErr) {
      console.error(userErr);
      return res.status(500).json({ msg: 'Server error (fetch user)' });
    }
    if (!userRow) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // 2) Optionally extract "reason" and "feedback"
    const { reason, feedback } = req.body || {};

    // 3) Insert a row in "deletionfeedback" (lowercase)
    const { error: feedErr } = await supabaseAdmin
      .from('deletionfeedback')
      .insert([
        {
          user_id: userRow.id,
          reason,
          feedback,
        },
      ]);
    if (feedErr) {
      console.error(feedErr);
      // not fatal, we can continue
    }

    console.log(
      `User #${userRow.id} is deleting their account.\nReason: ${reason}\nFeedback: ${feedback}`
    );

    // 4) If you want an Activity record for "deleteAccount" if reason is present
    if (reason) {
      await supabaseAdmin.from('activities').insert([
        {
          type: 'deleteAccount',
          user_id: userRow.id,
          mapTitle: null,
          created_at: new Date(),
        },
      ]);
    }

    // 5) Actually delete the user from "users"
    const { error: delErr } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', userRow.id);

    if (delErr) {
      console.error('Error deleting user account:', delErr);
      return res.status(500).json({ msg: 'Server error (delete user)' });
    }

    return res.json({ msg: 'User account deleted successfully' });
  } catch (err) {
    console.error('Error deleting user account:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

/* --------------------------------------------
   GET /api/users/:username/activity
   (Created maps, starred maps, commented)
-------------------------------------------- */

router.get('/:username/activity', async (req, res) => {
  const { username } = req.params;
  const offset = parseInt(req.query.offset, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || 10;

  try {
    // 1) Find the user by username
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

    // 2a) "Created" maps
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
      .limit(limit);

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

    // 2b) "Starred" maps => from "mapsaves"
    const { data: starredRows } = await supabaseAdmin
      .from('mapsaves')
      .select(`
        created_at,
        map_id,
        Map:maps(*)
      `)
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(limit);

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

    // 2c) "Commented" => user posted comments
    // Here we EXCLUDE any comments that are "hidden"
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
      .eq('status', 'visible')           // <--- ONLY VISIBLE COMMENTS
      .order('created_at', { ascending: false })
      .limit(limit);

    const commentedActivities = (userComments || []).map((comment) => {
      const map = comment.Map;
      return {
        type: 'commented',
        created_at: comment.created_at,
        commentContent: comment.content,
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

    // 4) Sort by created_at desc
    allActivities.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // 5) Apply offset + limit to the combined array
    const paginated = allActivities.slice(offset, offset + limit);

    return res.json(paginated);
  } catch (err) {
    console.error('Error fetching user activity:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});


/* --------------------------------------------
   PUT /api/users/change-password
-------------------------------------------- */
router.put('/change-password', auth, async (req, res) => {
  try {
    const user_id = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ msg: 'Missing required fields.' });
    }

    // 1) fetch user from "users"
    const { data: userRow, error: fetchErr } = await supabaseAdmin
      .from('users')
      .select('id, password')
      .eq('id', user_id)
      .maybeSingle();

    if (fetchErr) {
      console.error(fetchErr);
      return res.status(500).json({ msg: 'Error fetching user' });
    }
    if (!userRow) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // 2) compare old password with stored hash
    const isMatch = await bcrypt.compare(oldPassword, userRow.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Old password is incorrect.' });
    }

    // 3) hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // 4) update user row
    const { data: updatedUser, error: updateErr } = await supabaseAdmin
      .from('users')
      .update({ password: hashedPassword })
      .eq('id', userRow.id)
      .single();

    if (updateErr) {
      console.error(updateErr);
      return res.status(500).json({ msg: 'Error updating password' });
    }

    return res.json({ msg: 'Password updated successfully.' });
  } catch (err) {
    console.error('Error changing password:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
