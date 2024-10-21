// routes/maps.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Map = require('../models/map');
const User = require('../models/user');

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
router.get('/:id', auth, async (req, res) => {
  try {
    const map = await Map.findOne({ where: { id: req.params.id, UserId: req.user.id } }); // Use req.user.id
    if (!map) {
      return res.status(404).json({ msg: 'Map not found' });
    }
    res.json(map);
  } catch (err) {
    console.error('Error fetching map:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
