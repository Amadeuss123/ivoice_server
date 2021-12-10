const { DataTypes } = require('sequelize');

async function up(queryInterface) {
  await queryInterface.createTable('tasks', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    audio_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    task_type: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.INTEGER,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  await queryInterface.addConstraint('tasks', {
    fields: ['audio_id'],
    type: 'foreign key',
    name: 'task_audio_id_key',
    references: {
      table: 'audio',
      field: 'id',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
}

module.exports = {
  up,
};
