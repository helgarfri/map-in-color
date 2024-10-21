// models/user.js
const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const User = sequelize.define('User', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true, 
    allowNull: false 
  },
  email: { 
    type: DataTypes.STRING, 
    unique: true, 
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  password: { 
    type: DataTypes.STRING, 
    allowNull: false,
  },
  username: { 
    type: DataTypes.STRING, 
    unique: true, 
    allowNull: true, // Allows existing users without usernames
    validate: {
      len: [3, 50], // Username must be between 3 and 50 characters
    },
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

module.exports = User;
