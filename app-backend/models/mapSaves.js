// models/mapSaves.js
const { DataTypes, Sequelize } = require('sequelize'); // Import Sequelize
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW, // Set default value
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW, // Set default value
    },
  },
  {
    timestamps: true,
  }
);

module.exports = MapSaves;
