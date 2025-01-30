// routes/users.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { User, Map, Comment, MapSaves, Activity, DeletionFeedback } = require('../models');


// DELETE /api/users/deleteAccount
router.delete('/deleteAccount', auth, async (req, res) => {
  try {
    // The user must be logged in, so we have req.user.id from your auth middleware
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Optionally extract "reason" from the request body if you want
    // the user to send reason from the second step of your delete form
    const { reason, feedback } = req.body || {};

      // 1) Save to DeletionFeedback table
      await DeletionFeedback.create({
        userId: user.id, 
        reason,
        feedback,
      });
  

    // Log the reason & feedback
    console.log(
      `User #${user.id} is deleting their account.\nReason: ${reason}\nFeedback: ${feedback}`
    );

    // If you'd like to store a record that the user deleted
    // their account along with the reason:
    if (reason) {
      await Activity.create({
        type: 'deleteAccount',
        UserId: user.id,
        mapTitle: null, // or any other field
        createdAt: new Date(),

        // you could add a "reason" column to Activity if you want
      });
    }

    // Actually delete the user (this should cascade to Maps, Comments, etc. if set up)
    await user.destroy();

    return res.json({ msg: 'User account deleted successfully' });
  } catch (err) {
    console.error('Error deleting user account:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});


// GET /users/:username/activity
router.get('/:username/activity', async (req, res) => {
  const { username } = req.params;
  const offset = parseInt(req.query.offset, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || 10;

  try {
    // 1) Find the user by username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    console.log(`Fetching activity for user "${username}" offset=${offset} limit=${limit}`);

    // 2) "Created" maps => the user owns these maps
    //    We include enough fields on Map to render thumbnails
    const createdMaps = await Map.findAll({
      where: { UserId: user.id },
      include: [
        {
          model: User, // optional if you want map owner info
          attributes: ['id', 'username', 'firstName', 'lastName', 'profilePicture'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: limit, 
    });

    // Build "createdMap" records
    const createdActivities = createdMaps.map((map) => ({
      type: 'createdMap',
      createdAt: map.createdAt,             // needed for sorting
      map: {
        id: map.id,
        title: map.title,
        selectedMap: map.selectedMap,
        oceanColor: map.oceanColor,
        unassignedColor: map.unassignedColor,
        fontColor: map.fontColor,
        isTitleHidden: map.isTitleHidden,
        groups: map.groups,
        data: map.data,
        saveCount: map.saveCount,
        createdAt: map.createdAt,           // map creation time
      },
      commentContent: null, // not applicable for a createdMap
    }));

    // 3) "Starred" maps => from the MapSaves table
    //    We join the Map so we can render thumbnails.
    const starredRecords = await MapSaves.findAll({
      where: { UserId: user.id },
      include: [
        {
          model: Map,
          attributes: [
            'id',
            'title',
            'selectedMap',
            'oceanColor',
            'unassignedColor',
            'fontColor',
            'isTitleHidden',
            'groups',
            'data',
            'saveCount',
            'createdAt',
          ],
          include: [
            {
              model: User, 
              attributes: ['id', 'username', 'firstName', 'lastName', 'profilePicture'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: limit,
    });

    // Build "starredMap" records
    const starredActivities = starredRecords.map((save) => {
      const map = save.Map;
      return {
        type: 'starredMap',
        createdAt: save.createdAt,  // the time they starred the map
        map: map
          ? {
              id: map.id,
              title: map.title,
              selectedMap: map.selectedMap,
              oceanColor: map.oceanColor,
              unassignedColor: map.unassignedColor,
              fontColor: map.fontColor,
              isTitleHidden: map.isTitleHidden,
              groups: map.groups,
              data: map.data,
              saveCount: map.saveCount,
              createdAt: map.createdAt,
            }
          : null,
        commentContent: null, // not applicable for a starredMap
      };
    });

    // 4) "Commented" => user posted comments on maps
    //    We fetch the comment text + the map data
    const userComments = await Comment.findAll({
      where: { UserId: user.id },
      include: [
        {
          model: Map,
          attributes: [
            'id',
            'title',
            'selectedMap',
            'oceanColor',
            'unassignedColor',
            'fontColor',
            'isTitleHidden',
            'groups',
            'data',
            'saveCount',
            'createdAt',
          ],
          include: [
            {
              model: User, 
              attributes: ['id', 'username', 'firstName', 'lastName', 'profilePicture'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: limit,
    });

    // Build "commented" records
    const commentedActivities = userComments.map((comment) => {
      const map = comment.Map;
      return {
        type: 'commented',
        createdAt: comment.createdAt, // when the user posted the comment
        commentContent: comment.content,
        map: map
          ? {
              id: map.id,
              title: map.title,
              selectedMap: map.selectedMap,
              oceanColor: map.oceanColor,
              unassignedColor: map.unassignedColor,
              fontColor: map.fontColor,
              isTitleHidden: map.isTitleHidden,
              groups: map.groups,
              data: map.data,
              saveCount: map.saveCount,
              createdAt: map.createdAt,
            }
          : null,
      };
    });

    // 5) Combine all into one array
    let allActivities = [
      ...createdActivities,
      ...starredActivities,
      ...commentedActivities,
    ];

    // Sort by createdAt descending
    allActivities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // 6) Apply offset + limit to the combined array
    const paginated = allActivities.slice(offset, offset + limit);

    // Return them
    return res.json(paginated);
  } catch (err) {
    console.error('Error fetching user activity:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});


const bcrypt = require('bcrypt');

router.put('/change-password', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ msg: 'Missing required fields.' });
    }

    // Check old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Old password is incorrect.' });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    user.password = hashedPassword;
    await user.save();

    return res.json({ msg: 'Password updated successfully.' });
  } catch (err) {
    console.error('Error changing password:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});



module.exports = router;
