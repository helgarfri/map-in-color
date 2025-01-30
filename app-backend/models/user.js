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
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profilePicture: {
      type: DataTypes.STRING, // or DataTypes.BLOB for binary data
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);


// Define associations
User.associate = (models) => {
  User.hasMany(models.Map, { foreignKey: 'UserId' });
  User.belongsToMany(models.Map, {
    through: models.MapSaves,
    as: 'SavedMaps',
    foreignKey: 'UserId',
  });
};


module.exports = User;
