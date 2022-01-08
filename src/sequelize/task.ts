import { TaskStatus, TaskType } from '@const/task';
import { DataTypes, Sequelize } from 'sequelize';

export default function initTaskModel(sequelize: Sequelize) {
  const Task = sequelize.define(
    'Task',
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      audioId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      taskType: {
        type: DataTypes.TINYINT,
        defaultValue: TaskType.Recognize,
      },
      taskStatus: {
        type: DataTypes.TINYINT,
        defaultValue: TaskStatus.Waiting,
      },
    },
    {
      tableName: 'task',
      underscored: true,
    }
  );
  Task.belongsTo(sequelize.models.Audio, {
    foreignKey: 'audioId',
    targetKey: 'id',
  });
  Task.belongsTo(sequelize.models.User, {
    foreignKey: 'userId',
    targetKey: 'id',
  });

  return Task;
}
