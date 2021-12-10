const { DataTypes } = require('sequelize');

async function up(queryInterface) {
  await queryInterface.createTable('results', {
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
    task_id: {
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
  });

  await queryInterface.addConstraint('results', {
    fields: ['task_id'],
    type: 'foreign key',
    name: 'results_task_id_key',
    references: {
      table: 'tasks',
      field: 'id',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
}

module.exports = {
  up,
};
