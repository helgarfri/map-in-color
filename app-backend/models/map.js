// models/map.js
const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const User = require('./user');

const Map = sequelize.define('Map', {
  id: {
    type: DataTypes.BIGINT, // Use BIGINT to handle larger IDs
    autoIncrement: true,
    primaryKey: true,
  },
  title: { type: DataTypes.STRING },
  isTitleHidden: { type: DataTypes.BOOLEAN, defaultValue: false }, // Add this line
  description: { type: DataTypes.TEXT },
  tags: { type: DataTypes.ARRAY(DataTypes.STRING) },
  sources: { type: DataTypes.JSON },
  isPublic: { type: DataTypes.BOOLEAN, defaultValue: false },
  saveCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  data: { type: DataTypes.JSON },
  customRanges: { type: DataTypes.JSON },
  groups: { type: DataTypes.JSON },
  selectedMap: { type: DataTypes.STRING },
  oceanColor: { type: DataTypes.STRING },
  unassignedColor: { type: DataTypes.STRING },
  fontColor: { type: DataTypes.STRING },
  showTopHighValues: { type: DataTypes.BOOLEAN },
  showTopLowValues: { type: DataTypes.BOOLEAN },
  topHighValues: { type: DataTypes.JSON },
  topLowValues: { type: DataTypes.JSON },
  selectedPalette: { type: DataTypes.STRING },
  selectedMapTheme: { type: DataTypes.STRING },
  fileName: { type: DataTypes.STRING },
  fileStats: { type: DataTypes.JSON },
});

// Define associations with explicit foreignKey
User.hasMany(Map, { foreignKey: 'UserId', onDelete: 'CASCADE' });
Map.belongsTo(User, { foreignKey: 'UserId' });

module.exports = Map;
