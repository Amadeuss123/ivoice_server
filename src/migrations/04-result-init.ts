import { DataTypes, QueryInterface } from 'sequelize';

async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable('result', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    content: {
      type: DataTypes.TEXT,
    },
    path: {
      type: DataTypes.STRING,
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

  await queryInterface.addConstraint('result', {
    fields: ['task_id'],
    type: 'foreign key',
    name: 'results_task_id_key',
    references: {
      table: 'task',
      field: 'id',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
}

export {
  up,
};
