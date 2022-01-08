import { DataTypes, Sequelize } from 'sequelize';
import { TaskStatus } from 'src/const/task';

export default function initUserTaskModel(sequelize: Sequelize) {
  const UserTask = sequelize.define(
    'UserTask',
    {
      userId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      taskId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      taskStatus: {
        type: DataTypes.TINYINT,
        defaultValue: TaskStatus.Waiting,
      }
    },
    {
      tableName: 'usertask',
      underscored: true,
      createdAt: false,
      updatedAt: false,
    }
  );
  UserTask.belongsTo(sequelize.models.User, {
    foreignKey: 'userId',
    targetKey: 'id',
  });
  UserTask.belongsTo(sequelize.models.Task, {
    foreignKey: 'taskId',
    targetKey: 'id',
  });
  return UserTask;
};
