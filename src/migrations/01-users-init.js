const { DataTypes } = require('sequelize');

async function up(queryInterface, config, appLog) {
  await queryInterface.createTable(
    'users',
    {
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
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      uniqueKeys: {
        users_phone: {
          fields: ['phone'],
        },
      },
    }
  );
}

module.exports = {
  up,
};
