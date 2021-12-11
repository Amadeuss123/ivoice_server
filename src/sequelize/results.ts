import { DataTypes, Sequelize } from 'sequelize';

export default function initResultsModel(sequelize: Sequelize) {
  const Results = sequelize.define(
    'Results',
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      taskId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      tableName: 'results',
      underscored: true,
    }
  );

  Results.belongsTo(sequelize.models.Tasks, {
    foreignKey: 'taskId',
    targetKey: 'id',
  });

  return Results;
}