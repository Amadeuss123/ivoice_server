import { DataTypes, Sequelize } from 'sequelize';

export default function initTasksModel(sequelize: Sequelize) {
  const Tasks = sequelize.define(
    'Tasks',
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
      taskType: {
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: 'tasks',
      underscored: true,
    }
  );
  Tasks.belongsTo(sequelize.models.Audio, {
    foreignKey: 'audioId',
    targetKey: 'id',
  });

  return Tasks;
}
