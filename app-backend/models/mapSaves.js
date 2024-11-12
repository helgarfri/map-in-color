// models/mapSaves.js
const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const MapSaves = sequelize.define(
  'MapSaves',
  {
    UserId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    MapId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      references: {
        model: 'Maps',
        key: 'id',
      },
    },
  },
  {
    timestamps: false,
  }
);

module.exports = MapSaves;
