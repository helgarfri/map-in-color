// models/comment.js
const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const User = require('./user');
const Map = require('./map');

const Comment = sequelize.define('Comment', {
  content: { type: DataTypes.TEXT, allowNull: false },
  likeCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  dislikeCount: { type: DataTypes.INTEGER, defaultValue: 0 },

  // You can define it here or rely on Sequelize’s “belongsTo” approach
  ParentCommentId: {
    type: DataTypes.INTEGER, // or BIGINT if large IDs
    allowNull: true,
  },
});

User.hasMany(Comment, { onDelete: 'CASCADE' });
Comment.belongsTo(User);

Map.hasMany(Comment, { onDelete: 'CASCADE' });
Comment.belongsTo(Map);




module.exports = Comment;
