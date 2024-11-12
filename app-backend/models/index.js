// models/index.js
const sequelize = require('./db');
const Sequelize = require('sequelize');

const User = require('./user');
const Map = require('./map');
const MapSaves = require('./mapSaves');
const Comment = require('./comment');

// Define associations

// User and MapSaves association
User.belongsToMany(Map, {
  through: MapSaves,
  as: 'SavedMaps',
  foreignKey: 'UserId',
  otherKey: 'MapId',
});

// Map and MapSaves association
Map.belongsToMany(User, {
  through: MapSaves,
  as: 'Savers',
  foreignKey: 'MapId',
  otherKey: 'UserId',
});

// Other associations (e.g., User.hasMany(Map))
User.hasMany(Map, { foreignKey: 'UserId', onDelete: 'CASCADE' });
Map.belongsTo(User, { foreignKey: 'UserId' });

// Comments associations
Comment.belongsTo(User, { foreignKey: 'UserId' });
Comment.belongsTo(Map, { foreignKey: 'MapId' });
User.hasMany(Comment, { foreignKey: 'UserId', onDelete: 'CASCADE' });
Map.hasMany(Comment, { foreignKey: 'MapId', onDelete: 'CASCADE' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Map,
  MapSaves,
  Comment,
};
