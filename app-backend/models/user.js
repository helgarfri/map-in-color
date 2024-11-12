// models/user.js
const { DataTypes } = require('sequelize');
const sequelize = require('./db'); // Import the sequelize instance

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
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
      allowNull: true,
      validate: {
        len: [3, 50],
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = User;
