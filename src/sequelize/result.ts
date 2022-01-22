import { DataTypes, Sequelize } from 'sequelize';

export default function initResultModel(sequelize: Sequelize) {
  const Result = sequelize.define(
    'Result',
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      content: {
        type: DataTypes.TEXT,
      },
      taskId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      path: {
        type: DataTypes.STRING,
      },
      abstract: {
        type: DataTypes.STRING,
      }
    },
    {
      tableName: 'result',
      underscored: true,
    }
  );

  Result.belongsTo(sequelize.models.Task, {
    foreignKey: 'taskId',
    targetKey: 'id',
  });

  return Result;
}