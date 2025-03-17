// routes/profile.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const { check, validationResult } = require('express-validator');
const { resend } = require('../config/resend');


// 1) Import the service role client (admin) from supabase.js
const { supabaseAdmin } = require('../config/supabase');

/***********************************************
 *   GET USER ACTIVITY (CREATED / COMMENTED / STARRED)
 ***********************************************/
router.get('/:username/activity', async (req, res) => {
  const { username } = req.params;
  const offset = parseInt(req.query.offset, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || 10;

  console.log(
    `Fetching activity for username: ${username}, offset: ${offset}, limit: ${limit}`
  );

  try {
    // 1) Find the user by username in "users"
    const { data: foundUser, error: userErr } = await supabaseAdmin
      .from('users')
      .select('id, username, first_name, profile_picture')
      .eq('username', username)
      .maybeSingle();

    if (userErr) {
      console.error(userErr);
      return res.status(500).json({ msg: 'Server error (fetch user)' });
    }
    if (!foundUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (foundUser.status === 'banned') {
      return res.status(403).json({ msg: 'This user is banned.' });
    }

    const user_id = foundUser.id;

    // We'll do 3 separate queries:
    //   A) Created Maps
    //   B) Comments
    //   C) MapSaves => Starred

    // -------------------------------------------
    // A) "Created" Maps
    // -------------------------------------------
    const { data: createdMapsData, error: mapErr } = await supabaseAdmin
      .from('maps') // Or 'maps' if your table is lowercase
      .select(`
        id,
        title,
        selected_map,
        ocean_color,
        unassigned_color,
        groups,
        data,
        font_color,
        is_title_hidden,
        save_count,
        created_at
      `)
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (mapErr) {
      console.error('Error fetching created maps:', mapErr);
    }
    const createdMaps = createdMapsData || [];

    // -------------------------------------------
    // B) Comments by this user (both top-level and replies)
    // -------------------------------------------
    const { data: userCommentsData, error: commentErr } = await supabaseAdmin
      .from('comments') // Or 'comments' if table is lowercase
      .select(`
        id,
        content,
        created_at,
        parent_comment_id,
        map_id
      `)
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (commentErr) {
      console.error('Error fetching user comments:', commentErr);
    }
    const userComments = userCommentsData || [];

    // We do a multi-step approach to fetch associated maps + parent comments
    const mapIds = userComments.map((c) => c.map_id).filter(Boolean);
    const parent_comment_ids = userComments
      .map((c) => c.parent_comment_id)
      .filter(Boolean);

    let mapById = {};
    let parentCommentsById = {};

    // fetch maps for those comment mapIds
    if (mapIds.length > 0) {
      const { data: mapRows } = await supabaseAdmin
        .from('maps')
        .select(`
          id,
          title,
          selected_map,
          ocean_color,
          unassigned_color,
          groups,
          data,
          font_color,
          is_title_hidden,
          save_count,
          created_at
        `)
        .in('id', mapIds);

      if (mapRows) {
        mapRows.forEach((m) => {
          mapById[m.id] = m;
        });
      }
    }

    // fetch parent comments if needed
    if (parent_comment_ids.length > 0) {
      const { data: parentRows } = await supabaseAdmin
        .from('comments')
        .select('id, content, user_id')
        .in('id', parent_comment_ids);

      if (parentRows) {
        parentRows.forEach((pc) => {
          parentCommentsById[pc.id] = pc;
        });
      }

      // Also fetch the parent comment user info (optional)
      const parentOwnerIds = parentRows
        ? parentRows.map((p) => p.user_id).filter(Boolean)
        : [];
      let usersById = {};
      if (parentOwnerIds.length > 0) {
        const { data: parentUsers } = await supabaseAdmin
          .from('users')
          .select('id, username, profile_picture')
          .in('id', parentOwnerIds);
        if (parentUsers) {
          parentUsers.forEach((u) => {
            usersById[u.id] = u;
          });
        }
      }
      // Attach user info to parent comment
      parentRows?.forEach((pc) => {
        const pu = usersById[pc.user_id] || null;
        parentCommentsById[pc.id].User = pu;
      });
    }

    // build an array of "comment" activities
    const commentRecords = userComments.map((c) => {
      const isReply = !!c.parent_comment_id;
      const parentC = c.parent_comment_id ? parentCommentsById[c.parent_comment_id] : null;

      let parentCommentData = null;
      if (parentC) {
        parentCommentData = {
          id: parentC.id,
          content: parentC.content,
          User: parentC.User
            ? {
                username: parentC.User.username,
                profile_picture: parentC.User.profile_picture,
              }
            : null,
        };
      }

      return {
        type: isReply ? 'reply' : 'commented',
        user: {
          username: foundUser.username,
          first_name: foundUser.first_name || null,
          profile_picture: foundUser.profile_picture || null,
        },
        map: mapById[c.map_id] || null,
        comment_id: c.id,
        commentContent: c.content,
        created_at: c.created_at,
        commentObj: {
          ParentComment: parentCommentData,
        },
      };
    });

    // -------------------------------------------
    // C) MapSaves => starred
    // -------------------------------------------
    const { data: userSavesData } = await supabaseAdmin
      .from('mapsaves') // or 'map_saves' or 'mapSaves'
      .select('map_id, created_at')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(limit);

    const userSaves = userSavesData || [];
    const savedmap_ids = userSaves.map((s) => s.map_id);

    let savedMapById = {};
    if (savedmap_ids.length > 0) {
      const { data: savedMaps } = await supabaseAdmin
        .from('maps')
        .select(`
          id,
          title,
          selected_map,
          ocean_color,
          unassigned_color,
          groups,
          data,
          font_color,
          is_title_hidden,
          save_count,
          created_at
        `)
        .in('id', savedmap_ids);

      if (savedMaps) {
        savedMaps.forEach((m) => {
          savedMapById[m.id] = m;
        });
      }
    }

    const starredRecords = userSaves.map((save) => ({
      type: 'starredMap',
      user: {
        username: foundUser.username,
        first_name: foundUser.first_name || null,
      },
      map: savedMapById[save.map_id] || null,
      created_at: save.created_at,
    }));

    // Combine everything into activities
    const activities = [];

    // "createdMap" items
    createdMaps.forEach((m) => {
      activities.push({
        type: 'createdMap',
        user: {
          username: foundUser.username,
          first_name: foundUser.first_name || null,
        },
        map: m,
        created_at: m.created_at,
      });
    });

    // add commentRecords
    commentRecords.forEach((cr) => activities.push(cr));

    // add starredRecords
    starredRecords.forEach((sr) => activities.push(sr));

    // Sort by created_at DESC
    activities.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Slice for pagination
    const paginated = activities.slice(offset, offset + limit);

    return res.json(paginated);
  } catch (err) {
    console.error('Error fetching user activity:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// NEW: We'll store the file in memory, then upload to Supabase
const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage });


/***********************************************
 *   VALIDATION RULES FOR PROFILE UPDATES
 ***********************************************/
const profileValidationRules = [
  [
    check('email', 'Please include a valid email').optional().isEmail(),
    check('username', 'Username must be at least 3 characters')
      .optional()
      .isLength({ min: 3 }),
    check('location', 'Location must be a string').optional().isString(),
    check('description', 'Description must be a string').optional().isString(),
    check('gender', 'Gender must be a string').optional().isString(),
    check('first_name', 'First name must be a string').optional().isString(),
    check('last_name', 'Last name must be a string').optional().isString(),
    check('date_of_birth', 'Date of birth must be a valid date')
      .optional()
      .isISO8601(),
  ],
];

const profileUpdateMiddleware = [
  auth,
  upload.single('profile_picture'),
  ...profileValidationRules,
];


/***********************************************
 *   GET CURRENT USER'S PROFILE (LOGGED-IN)
 ***********************************************/
router.get('/', auth, async (req, res) => {
  console.log(`Fetching profile for user ID: ${req.user.id}`);
  try {
    const { data: userRow, error } = await supabaseAdmin
      .from('users')
      .select(
        'id, username, email, first_name, last_name, date_of_birth, location, description, gender, profile_picture, created_at, updated_at'
      )
      .eq('id', req.user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({ msg: 'Server error' });
    }

    if (!userRow) {
      return res.status(404).json({ msg: 'User not found' });
    }

    return res.json(userRow);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

/***********************************************
 *   GET USER PROFILE BY USERNAME (PUBLIC)
 ***********************************************/
router.get('/:username', async (req, res) => {
  const { username } = req.params;
  console.log(`Fetching profile for username: ${username}`);

  try {
    const { data: userRow, error } = await supabaseAdmin
      .from('users')
      .select(
        'id, username, first_name, last_name, date_of_birth, location, description, gender, profile_picture, created_at, updated_at, status'
      )
      .eq('username', username)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user by username:', error);
      return res.status(500).json({ msg: 'Server error' });
    }
    if (!userRow) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (userRow.status === 'banned') {
      return res.status(403).json({ msg: 'This user is banned.' });
    }

    return res.json(userRow);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

/***********************************************
 *   UPDATE PROFILE (PUT /api/profile)
 ***********************************************/
router.put('/', profileUpdateMiddleware, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    email,
    username,
    first_name,
    last_name,
    date_of_birth,
    location,
    description,
    gender,
  } = req.body;

  try {
    // 1) fetch user from "users"
    const { data: userRow, error: findErr } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', req.user.id)
      .maybeSingle();

    if (findErr) {
      console.error('Error fetching user row:', findErr);
      return res.status(500).json({ msg: 'Server error (fetch user)' });
    }
    if (!userRow) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // 2) If user updates username, check if taken
    if (username && username !== userRow.username) {
      const { data: sameName, error: nameErr } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('username', username)
        .maybeSingle();

      if (nameErr) {
        console.error('Error checking username:', nameErr);
        return res.status(500).json({ msg: 'Error checking username' });
      }
      if (sameName) {
        return res.status(400).json({ msg: 'Username already taken' });
      }
    }

    // 3) Build an update object
    const updateData = {};
    if (email) updateData.email = email;
    if (username) updateData.username = username;
    if (first_name !== undefined) updateData.first_name = first_name;
    if (last_name !== undefined) updateData.last_name = last_name;
    if (location !== undefined) updateData.location = location;
    if (description !== undefined) updateData.description = description;
    if (gender !== undefined) updateData.gender = gender;

    // Only set date_of_birth if userRow.date_of_birth is null
    if (!userRow.date_of_birth && date_of_birth) {
      updateData.date_of_birth = date_of_birth;
    }

    // 4) Handle profile picture if a file is uploaded
    if (req.file) {
      // 1) Create a unique filename
      const fileExt = path.extname(req.file.originalname);
      const fileName = `${req.user.id}_${Date.now()}${fileExt}`;
    
      // 2) Upload file buffer to Supabase Storage bucket "profile-pictures"
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('profile-pictures')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true,
        });
    
      if (uploadError) {
        console.error('Error uploading to Supabase Storage:', uploadError);
        return res.status(500).json({ msg: 'Error uploading image.' });
      }
    
      // 3) Retrieve the public URL from the uploaded file
      const { data: publicUrlData } = supabaseAdmin.storage
        .from('profile-pictures')
        .getPublicUrl(fileName);
    
      // 4) Save that public URL to the user’s "profile_picture" column
      updateData.profile_picture = publicUrlData.publicUrl;
    }
    

    // 5) update row
    const { data: updatedRows, error: updateErr } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('id', req.user.id)
      .select('*')   
      .single();

    if (updateErr) {
      console.error('Error updating user:', updateErr);
      return res.status(500).json({ msg: 'Server error updating profile' });
    }

    // Return updated record
    return res.json(updatedRows);
  } catch (err) {
    console.error('Error updating profile:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

/***********************************************
 *   POST /profile/:username/report
 *   Allows a logged-in user to report another user’s profile
 ***********************************************/
router.post('/:username/report', auth, async (req, res) => {
  try {
    const { username } = req.params;
    const { reasons, details } = req.body; // same shape as comment reports
    const reportingUserId = req.user.id;   // from auth middleware

    // 1) Find the user by username
    const { data: reportedUser, error: userErr } = await supabaseAdmin
      .from('users')
      .select('id, username, profile_picture, status')
      .eq('username', username)
      .maybeSingle();

    if (userErr) {
      console.error('Error fetching user:', userErr);
      return res.status(500).json({ msg: 'Server error (fetch user)' });
    }
    if (!reportedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Don’t allow a user to report themselves, if that’s your policy:
    if (reportedUser.id === reportingUserId) {
      return res.status(400).json({ msg: 'You cannot report yourself.' });
    }

    // 2) Insert the new row into "profile_reports"
    const { error: repErr } = await supabaseAdmin
      .from('profile_reports')
      .insert({
        reported_user_id: reportedUser.id,
        reported_by: reportingUserId,
        reasons,
        details,
        status: 'pending',
      });
    if (repErr) {
      console.error('Error inserting profile report:', repErr);
      return res.status(500).json({ msg: 'Error inserting profile report' });
    }

    // 3) Count how many unique users have reported this profile
    const { data: allReports, error: fetchErr } = await supabaseAdmin
      .from('profile_reports')
      .select('reported_by')
      .eq('reported_user_id', reportedUser.id);

    if (fetchErr) {
      console.error('Error fetching profile reports:', fetchErr);
      return res.status(500).json({ msg: 'Error fetching profile reports' });
    }

    const distinctReporters = new Set(allReports.map((r) => r.reported_by));
    const reportCount = distinctReporters.size;

    // 4) If the user has 2 or more distinct reporters, we can mark them “flagged” or hide them, etc.
    // Adjust logic as needed
    if (reportCount >= 3) {
      // e.g. mark user as “flagged” or “hidden” in the user table
      // or do something else. For example:
      const { error: updErr } = await supabaseAdmin
        .from('users')
        .update({ status: 'flagged' }) // or “suspended”
        .eq('id', reportedUser.id);
      if (updErr) {
        console.error('Error flagging user:', updErr);
        // we can still continue, or handle as needed
      }
    }

    // 5) Send emails to the user who filed the report, and to admin
    // Same pattern as your comment report code
    // a) fetch reporter info
    const { data: reporterInfo, error: repInfoErr } = await supabaseAdmin
      .from('users')
      .select('email, username')
      .eq('id', reportingUserId)
      .maybeSingle();

    // b) email the reporter, if email is present
    if (reporterInfo?.email) {
      try {
        await resend.emails.send({
          from: 'no-reply@mapincolor.com',
          to: reporterInfo.email,
          subject: 'We have received your profile report',
          text: `Hello ${reporterInfo.username},\n\n` +
                `We have received your report regarding user "${username}".\n` +
                `Reasons: ${reasons}\nDetails: ${details}\n\n` +
                `Thank you for helping us keep the community safe.\n` +
                `- Helgi from Map in Color`,
        });
      } catch (emailErr) {
        console.error('Error sending user confirmation email:', emailErr);
      }
    }

    // c) email admin
    try {
      await resend.emails.send({
        from: 'no-reply@mapincolor.com',
        to: 'hello@mapincolor.com',  // your admin email
        subject: `New profile report for @${username}`,
        text: `A user has reported profile @${username}.\n` +
              `Reporter: ${reporterInfo?.username} (ID: ${reportingUserId})\n` +
              `Reasons: ${reasons}\nDetails: ${details}\n\n` +
              `Total unique reporters so far: ${reportCount}\n`,
      });
    } catch (adminEmailErr) {
      console.error('Error sending admin notification email:', adminEmailErr);
    }

    return res.json({
      msg: `Profile reported successfully. User @${username} now has ${reportCount} total unique report(s).`
    });
  } catch (err) {
    console.error('Error reporting user profile:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});


module.exports = router;
