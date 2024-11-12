// routes/maps.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authOptional = require('../middleware/authOptional'); // Import authOptional

const { Map, User, MapSaves } = require('../models');
// Get all maps for a user
router.get('/', auth, async (req, res) => {
  try {
    const maps = await Map.findAll({ where: { UserId: req.user.id } }); // Use req.user.id
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
    const map = await Map.create({
      ...mapData,
      UserId: req.user.id, // Use req.user.id
    });
    res.json(map);
  } catch (err) {
    console.error('Error creating map:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update a map
router.put('/:id', auth, async (req, res) => {
  try {
    const map = await Map.findOne({ where: { id: req.params.id, UserId: req.user.id } }); // Use req.user.id
    if (!map)
      return res.status(404).json({ msg: 'Map not found or unauthorized' });

    await map.update(req.body);
    res.json(map);
  } catch (err) {
    console.error('Error updating map:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete a map
router.delete('/:id', auth, async (req, res) => {
  try {
    const map = await Map.findOne({ where: { id: req.params.id, UserId: req.user.id } }); // Use req.user.id
    if (!map)
      return res.status(404).json({ msg: 'Map not found or unauthorized' });

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
      include: [{ model: User, attributes: ['username'] }],
    });

    if (!map) {
      return res.status(404).json({ msg: 'Map not found' });
    }

    // If the map is private and doesn't belong to the user, deny access
    if (!map.isPublic && (!req.user || map.UserId !== req.user.id)) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    let isSavedByCurrentUser = false;
    if (req.user) {
      const mapSave = await MapSaves.findOne({
        where: { MapId: map.id, UserId: req.user.id },
      });
      isSavedByCurrentUser = !!mapSave;
    }

    const mapData = map.toJSON();
    mapData.isSavedByCurrentUser = isSavedByCurrentUser;
    res.json(mapData);
  } catch (err) {
    console.error('Error fetching map:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// save a map
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
      res.json({ msg: 'Map saved' });
    } else {
      res.status(400).json({ msg: 'Map already saved' });
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
    // Remove the save record
    await MapSaves.destroy({ where: { MapId: map.id, UserId: req.user.id } });
    map.saveCount = Math.max(0, map.saveCount - 1);
    await map.save();
    res.json({ msg: 'Map unsaved' });
  } catch (err) {
    console.error('Error unsaving map:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});



module.exports = router;
