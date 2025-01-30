// models/index.js
const sequelize = require('./db');
const Sequelize = require('sequelize');

const User = require('./user');
const Map = require('./map');
const MapSaves = require('./mapSaves');
const Comment = require('./comment');
const CommentReaction = require('./commentReaction');
const Notification = require('./notification');
const Activity = require('./activity'); // Import Activity model
const DeletionFeedback = require('./deletionFeedback');

// Define associations



// User and MapSaves association
User.belongsToMany(Map, {
  through: MapSaves,
  as: 'SavedMaps',
  foreignKey: 'UserId',
  otherKey: 'MapId',
});

Map.belongsToMany(User, {
  through: MapSaves,
  as: 'Savers',
  foreignKey: 'MapId',
  otherKey: 'UserId',
});

// MapSaves associations
MapSaves.belongsTo(Map, { foreignKey: 'MapId' });
Map.hasMany(MapSaves, { foreignKey: 'MapId' });

MapSaves.belongsTo(User, { foreignKey: 'UserId' });
User.hasMany(MapSaves, { foreignKey: 'UserId' });


// User and Map associations
User.hasMany(Map, { foreignKey: 'UserId', onDelete: 'CASCADE' });
Map.belongsTo(User, { foreignKey: 'UserId' });

// Comment associations
Comment.belongsTo(User, { foreignKey: 'UserId' });
Comment.belongsTo(Map, { foreignKey: 'MapId' });
User.hasMany(Comment, { foreignKey: 'UserId', onDelete: 'CASCADE' });
Map.hasMany(Comment, { foreignKey: 'MapId', onDelete: 'CASCADE' });

// Reply associations
Comment.hasMany(Comment, { as: 'Replies', foreignKey: 'ParentCommentId', onDelete: 'CASCADE' });
Comment.belongsTo(Comment, { as: 'ParentComment', foreignKey: 'ParentCommentId' });

// CommentReaction associations
CommentReaction.belongsTo(User, { foreignKey: 'UserId' });
CommentReaction.belongsTo(Comment, { foreignKey: 'CommentId' });
User.hasMany(CommentReaction, { foreignKey: 'UserId', onDelete: 'CASCADE' });
Comment.hasMany(CommentReaction, { foreignKey: 'CommentId', onDelete: 'CASCADE' });

// Notification associations
Notification.belongsTo(User, { as: 'Recipient', foreignKey: 'UserId', onDelete: 'CASCADE' });
Notification.belongsTo(User, { as: 'Sender', foreignKey: 'SenderId', onDelete: 'CASCADE' });
Notification.belongsTo(Map, { foreignKey: 'MapId' });
Notification.belongsTo(Comment, { foreignKey: 'CommentId' });


// Reverse associations for Notifications
User.hasMany(Notification, { as: 'ReceivedNotifications', foreignKey: 'UserId', onDelete: 'CASCADE' });
User.hasMany(Notification, { as: 'SentNotifications', foreignKey: 'SenderId', onDelete: 'CASCADE' });
Map.hasMany(Notification, { foreignKey: 'MapId', onDelete: 'CASCADE' });
Comment.hasMany(Notification, { foreignKey: 'CommentId', onDelete: 'CASCADE' });

// Activity associations
Activity.belongsTo(User, { foreignKey: 'UserId', onDelete: 'CASCADE' });
User.hasMany(Activity, { foreignKey: 'UserId', onDelete: 'CASCADE' });


module.exports = {
  sequelize,
  Sequelize,
  User,
  Map,
  MapSaves,
  Comment,
  CommentReaction,
  Notification,
  Activity,
  DeletionFeedback, // Export the new model

  
};
