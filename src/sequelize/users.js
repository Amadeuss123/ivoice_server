const { DataTypes } = require('sequelize');

module.exports = function (sequelize) {
  const Users = sequelize.define(
    'Users',
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      passhash: {
        type: DataTypes.STRING,
      }
    },
    {
      tableName: 'users',
      underscored: true,
    }
  );
  return Users;
}