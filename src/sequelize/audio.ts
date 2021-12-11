import { DataTypes, Sequelize } from 'sequelize';

export default function initAudioModel(sequelize: Sequelize) {
  const Audio = sequelize.define(
    'Audio',
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
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      audioTime: {
        type: DataTypes.FLOAT,
      },
    },
    {
      tableName: 'audio',
      underscored: true,
    }
  );
  Audio.belongsTo(sequelize.models.Users, {
    foreignKey: 'userId',
    targetKey: 'id',
  });

  return Audio;
};
