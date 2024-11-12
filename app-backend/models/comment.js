// models/comment.js
const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const User = require('./user');
const Map = require('./map');

const Comment = sequelize.define('Comment', {
  content: { type: DataTypes.TEXT, allowNull: false },
});

User.hasMany(Comment, { onDelete: 'CASCADE' });
Comment.belongsTo(User);

Map.hasMany(Comment, { onDelete: 'CASCADE' });
Comment.belongsTo(Map);

module.exports = Comment;
