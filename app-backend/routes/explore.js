// routes/explore.js

const express = require('express');
const router = express.Router();
const { Op, Sequelize } = require('sequelize');
const { Map, User, sequelize } = require('../models');

router.get('/', async (req, res) => {
  try {
    let { sort = 'newest', search = '', tags = '' } = req.query;

    search = search.trim();
    const tagsArray = tags ? tags.split(',').map(t => t.trim().toLowerCase()) : [];

    let whereClause = {
      isPublic: true,
    };

    if (search) {
      whereClause.title = {
        [Op.iLike]: `%${search}%`
      };
    }

    if (tagsArray.length > 0) {
      whereClause.tags = {
        [Op.overlap]: tagsArray
      };
    }

    // Common include with full user attributes
    const userInclude = { 
      model: User, 
      attributes: ['id', 'username', 'firstName', 'lastName', 'profilePicture'] 
    };

    if (sort === 'newest') {
      const maps = await Map.findAll({
        where: whereClause,
        include: [userInclude],
        order: [['createdAt', 'DESC']],
        limit: 50
      });
      return res.json(maps);
    } else if (sort === 'starred') {
      const maps = await Map.findAll({
        where: whereClause,
        include: [userInclude],
        order: [['saveCount', 'DESC']],
        limit: 50
      });
      return res.json(maps);
    } else if (sort === 'trending') {
      let query = `
        SELECT "Maps".*, "Users".username, "Users"."firstName", "Users"."lastName", "Users"."profilePicture",
        COALESCE((
          SELECT COUNT(*) 
          FROM "MapSaves"
          WHERE "MapSaves"."MapId"="Maps".id
          AND "MapSaves"."createdAt" >= NOW() - INTERVAL '3 days'
        ),0) as recent_saves
        FROM "Maps"
        JOIN "Users" ON "Maps"."UserId"="Users".id
        WHERE "Maps"."isPublic"=true
      `;

      if (search) {
        query += ` AND "Maps"."title" ILIKE '%${search}%'`;
      }
      if (tagsArray.length > 0) {
        const tagsString = '{' + tagsArray.join(',') + '}';
        query += ` AND "Maps"."tags" && '${tagsString}'`;
      }

      query += ` ORDER BY recent_saves DESC LIMIT 50;`;

      const [maps, metadata] = await sequelize.query(query);
      return res.json(maps);
    } else {
      // Default fallback: newest
      const maps = await Map.findAll({
        where: whereClause,
        include: [userInclude],
        order: [['createdAt', 'DESC']],
        limit: 50
      });
      return res.json(maps);
    }

  } catch (err) {
    console.error('Error in /explore route:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
