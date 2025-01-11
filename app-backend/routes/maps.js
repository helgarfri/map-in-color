// src/routes/maps.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authOptional = require('../middleware/authOptional');

const { Map, User, MapSaves, Activity } = require('../models');
const Notification = require('../models/notification');

// Get all maps for a user
router.get('/', auth, async (req, res) => {
  try {
    const maps = await Map.findAll({ where: { UserId: req.user.id } });
    res.json(maps);
  } catch (err) {
    console.error('Error fetching maps:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Create a new map
router.post('/', auth, async (req, res) => {
  const mapData = req.body;

  try {
    // Normalize tags to lowercase
    if (Array.isArray(mapData.tags)) {
      mapData.tags = mapData.tags.map(tag => tag.toLowerCase());
    }

    const map = await Map.create({
      ...mapData,
      UserId: req.user.id,
    });

    // Create an activity record
    await Activity.create({
      type: 'createdMap',
      UserId: req.user.id,
      mapTitle: map.title,
      createdAt: new Date(),
    });

    res.json(map);
  } catch (err) {
    console.error('Error creating map:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get saved maps for the authenticated user
router.get('/saved', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const savedMaps = await user.getSavedMaps({
      include: [{ model: User, attributes: ['username'] }],
    });

    res.json(savedMaps);
  } catch (err) {
    console.error('Error fetching saved maps:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Increment download count for a map
router.post('/:id/download', authOptional, async (req, res) => {
  try {
    const map = await Map.findByPk(req.params.id);
    if (!map || (!map.isPublic && (!req.user || map.UserId !== req.user.id))) {
      return res.status(404).json({ msg: 'Map not found' });
    }

    // Increment the download count
    map.downloadCount = (map.downloadCount || 0) + 1;
    await map.save();
    console.log('DownloadCount AFTER increment:', map.downloadCount);

    // Optionally, record an Activity or Notification
    // await Activity.create({ ... })

    return res.json({ downloadCount: map.downloadCount });

  } catch (err) {
    console.error('Error incrementing download count:', err);
    res.status(500).json({ msg: 'Server error' });
  }
  
});




// Update a map
router.put('/:id', auth, async (req, res) => {
  try {
    const map = await Map.findOne({ where: { id: req.params.id, UserId: req.user.id } });
    if (!map) return res.status(404).json({ msg: 'Map not found or unauthorized' });

    const updateData = { ...req.body };
    // Normalize tags to lowercase if present
    if (Array.isArray(updateData.tags)) {
      updateData.tags = updateData.tags.map(tag => tag.toLowerCase());
    }

    await map.update(updateData);
    res.json(map);
  } catch (err) {
    console.error('Error updating map:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete a map
router.delete('/:id', auth, async (req, res) => {
  try {
    const map = await Map.findOne({ where: { id: req.params.id, UserId: req.user.id } });
    if (!map) return res.status(404).json({ msg: 'Map not found or unauthorized' });

    await map.destroy();
    res.json({ msg: 'Map deleted' });
  } catch (err) {
    console.error('Error deleting map:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get a single map by ID
router.get('/:id', authOptional, async (req, res) => {
  try {
    const map = await Map.findOne({
      where: { id: req.params.id },
      include: [{ model: User, attributes: ['id', 'username', 'firstName', 'lastName', 'profilePicture'] }],
    });

    if (!map) {
      return res.status(404).json({ msg: 'Map not found' });
    }

    if (!map.isPublic && (!req.user || map.UserId !== req.user.id)) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    let isSavedByCurrentUser = false;
    let isOwner = false;
    if (req.user) {
      isOwner = map.UserId === req.user.id;
      const mapSave = await MapSaves.findOne({ where: { MapId: map.id, UserId: req.user.id } });
      isSavedByCurrentUser = !!mapSave;
    }

    const mapData = map.toJSON();
    mapData.isSavedByCurrentUser = isSavedByCurrentUser;
    mapData.isOwner = isOwner;

    res.json(mapData);
  } catch (err) {
    console.error('Error fetching map:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Save a map
router.post('/:id/save', auth, async (req, res) => {
  try {
    const map = await Map.findByPk(req.params.id);
    if (!map || (!map.isPublic && map.UserId !== req.user.id)) {
      return res.status(404).json({ msg: 'Map not found' });
    }

    const [mapSave, created] = await MapSaves.findOrCreate({
      where: { MapId: map.id, UserId: req.user.id },
    });

    if (created) {
      map.saveCount += 1;
      await map.save();

      await Activity.create({
        type: 'starredMap',
        UserId: req.user.id,
        mapTitle: map.title,
        createdAt: new Date(),
      });

      if (map.UserId !== req.user.id) {
        await Notification.create({
          type: 'star',
          UserId: map.UserId,
          SenderId: req.user.id,
          MapId: map.id,
        });
      }

      res.json({ msg: 'Map saved' });
    } else {
      res.status(200).json({ msg: 'Map already saved' });
    }
  } catch (err) {
    console.error('Error saving map:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Unsave a map
router.post('/:id/unsave', auth, async (req, res) => {
  try {
    const map = await Map.findByPk(req.params.id);
    if (!map || (!map.isPublic && map.UserId !== req.user.id)) {
      return res.status(404).json({ msg: 'Map not found' });
    }

    await MapSaves.destroy({ where: { MapId: map.id, UserId: req.user.id } });
    map.saveCount = Math.max(0, map.saveCount - 1);
    await map.save();
    res.json({ msg: 'Map unsaved' });
  } catch (err) {
    console.error('Error unsaving map:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Fetch maps by user ID with pagination (public only)
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const offset = parseInt(req.query.offset) || 0;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const maps = await Map.findAll({
      where: {
        UserId: userId,
        isPublic: true
      },
      order: [['createdAt', 'DESC']],
      offset,
      limit,
    });

    res.json(maps);
  } catch (err) {
    console.error('Error fetching maps:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch starred maps by user ID with pagination (public only)
router.get('/user/:userId/starred', async (req, res) => {
  const { userId } = req.params;
  const offset = parseInt(req.query.offset) || 0;
  const limit = parseInt(req.query.limit) || 10;

  try {
    // Find the user
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Fetch starred maps using the association, filtering by isPublic: true
    const starredMaps = await user.getSavedMaps({
      where: { isPublic: true }, // Only public maps
      offset: offset,
      limit: limit,
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['id', 'username'] }],
    });

    res.json(starredMaps);
  } catch (err) {
    console.error('Error fetching starred maps:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Get total maps and total stars for a user
router.get('/user/:userId/stats', async (req, res) => {
  const { userId } = req.params;

  try {
    const maps = await Map.findAll({ where: { UserId: userId } });
    const totalMaps = maps.length;
    const totalStars = maps.reduce((total, map) => total + (map.saveCount || 0), 0);

    res.json({ totalMaps, totalStars });
  } catch (err) {
    console.error('Error fetching user stats:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get the most starred map for a user
router.get('/user/:userId/most-starred', async (req, res) => {
  const { userId } = req.params;

  try {
    const mostStarredMap = await Map.findOne({
      where: { UserId: userId },
      order: [['saveCount', 'DESC']],
    });

    res.json(mostStarredMap);
  } catch (err) {
    console.error('Error fetching most starred map:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get starred maps by user ID with pagination
router.get('/user/:userId/starred', async (req, res) => {
  const { userId } = req.params;
  const offset = parseInt(req.query.offset) || 0;
  const limit = parseInt(req.query.limit) || 10;

  try {
    // Find the user
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Fetch starred maps using Sequelize's association methods
    const starredMaps = await user.getSavedMaps({
      offset: offset,
      limit: limit,
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['username'] }], // Include map owner's username
    });

    res.json(starredMaps);
  } catch (err) {
    console.error('Error fetching starred maps:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get starred maps by user ID with pagination
router.get('/user/:userId/starred', async (req, res) => {
  const { userId } = req.params;
  const offset = parseInt(req.query.offset) || 0;
  const limit = parseInt(req.query.limit) || 10;

  try {
    // Find the user
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Fetch starred maps using the association
    const starredMaps = await user.getSavedMaps({
      offset: offset,
      limit: limit,
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['id', 'username'] }], // Include map owner's username
    });

    res.json(starredMaps);
  } catch (err) {
    console.error('Error fetching starred maps:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
