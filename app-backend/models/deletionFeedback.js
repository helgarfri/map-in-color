// models/deletionFeedback.js
const { DataTypes } = require('sequelize');
const sequelize = require('./db'); // import the same sequelize instance you use in other models

// Define the DeletionFeedback model
const DeletionFeedback = sequelize.define('DeletionFeedback', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    // We store which user was deleted.
    // Even after the user is gone, we keep this ID as a reference (if you want).
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: true, // or false if reason must be provided
  },
  feedback: {
    // Optionally store additional user feedback
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'DeletionFeedback', // optional, otherwise table name will be "DeletionFeedbacks"
  timestamps: true,             // adds createdAt, updatedAt columns
});

module.exports = DeletionFeedback;
