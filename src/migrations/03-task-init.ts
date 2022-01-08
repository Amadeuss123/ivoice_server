import { DataTypes, QueryInterface } from 'sequelize';
import { TaskStatus, TaskType } from '@const/task';

async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable('task', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    audio_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    task_type: {
      type: DataTypes.TINYINT,
      defaultValue: TaskType.Recognize,
    },
    task_status: {
      type: DataTypes.TINYINT,
      defaultValue: TaskStatus.Waiting,
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

  await queryInterface.addConstraint('task', {
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
  await queryInterface.addConstraint('task', {
    fields: ['user_id'],
    type: 'foreign key',
    name: 'task_user_id_key',
    references: {
      table: 'user',
      field: 'id',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
}

module.exports = {
  up,
};
