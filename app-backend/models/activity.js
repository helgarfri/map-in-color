// models/activity.js
const { DataTypes } = require('sequelize');
const sequelize = require('./db'); // Adjust the path if necessary

const Activity = sequelize.define('Activity', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mapTitle: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // Include any additional fields relevant to your activities
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Activity;
