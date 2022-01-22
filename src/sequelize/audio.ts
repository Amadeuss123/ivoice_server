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
      duration: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      sampleRate: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bitRate: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      channels: {
        type: DataTypes.TINYINT,
        allowNull: false,
      },
      format: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      tableName: 'audio',
      underscored: true,
    }
  );
  Audio.belongsTo(sequelize.models.User, {
    foreignKey: 'userId',
    targetKey: 'id',
  });

  return Audio;
};
