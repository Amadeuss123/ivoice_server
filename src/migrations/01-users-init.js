const { DataTypes } = require('sequelize');

async function up(queryInterface, config, appLog) {
  await queryInterface.createTable('users', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
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
      allowNull: false,
    }
  },
  {
    uniqueKeys: {
      users_phone: {
        fields: ['phone'],
      },
    },
  });
}

module.exports = {
  up,
};
