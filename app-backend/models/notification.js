// models/notification.js
const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Notification = sequelize.define('Notification', {
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  SenderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  MapId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  CommentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

// Do not define associations here

module.exports = Notification;
