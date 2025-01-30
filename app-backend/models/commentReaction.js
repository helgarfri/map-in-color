// models/commentReaction.js
const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const User = require('./user');
const Comment = require('./comment');

const CommentReaction = sequelize.define('CommentReaction', {
  reaction: {
    type: DataTypes.ENUM('like', 'dislike'),
    allowNull: false,
  },
});

// Associations
User.belongsToMany(Comment, {
  through: CommentReaction,
  as: 'ReactedComments',
  foreignKey: 'UserId',
  otherKey: 'CommentId',
});
Comment.belongsToMany(User, {
  through: CommentReaction,
  as: 'ReactedUsers',
  foreignKey: 'CommentId',
  otherKey: 'UserId',
});

CommentReaction.belongsTo(User);
CommentReaction.belongsTo(Comment);
User.hasMany(CommentReaction);
Comment.hasMany(CommentReaction);

module.exports = CommentReaction;
