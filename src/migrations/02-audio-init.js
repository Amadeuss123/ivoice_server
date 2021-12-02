const { DataTypes } = require('sequelize');
const migrationUtils = require('../lib/migrator/migration-utils');

async function up(queryInterface, config, appLog) {
  await queryInterface.createTable('audio', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    audio_time: {
      type: DataTypes.FLOAT,
    },
  });

  await queryInterface.addConstraint('audio', {
    fields: ['user_id'],
    type: 'foreign key',
    name: 'audio_user_id_key',
    references: {
      table: 'users',
      field: 'id',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
}

module.exports = {
  up,
}

