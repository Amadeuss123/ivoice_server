const { DataTypes } = require('sequelize');

module.exports = function (sequelize) {
  const Cache = sequelize.define(
    'Cache',
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      data: {
        type: DataTypes.JSON,
      },
      expireDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: 'cache',
      underscored: true,
      updatedAt: false,
    }
  );

  return Cache;
};
