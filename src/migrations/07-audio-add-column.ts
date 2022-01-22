import { DataTypes, QueryInterface } from 'sequelize';

async function up(queryInterface: QueryInterface) {
  await queryInterface.addColumn('audio', 'sample_rate', {
    type: DataTypes.INTEGER,
    allowNull: false,
  });
  await queryInterface.addColumn('audio', 'bit_rate', {
    type: DataTypes.INTEGER,
    allowNull: false,
  });
  await queryInterface.addColumn('audio', 'channels', {
    type: DataTypes.TINYINT,
    allowNull: false,
  });
  await queryInterface.addColumn('audio', 'duration', {
    type: DataTypes.FLOAT,
    allowNull: false,
  });
  await queryInterface.addColumn('audio', 'format', {
    type: DataTypes.STRING,
    allowNull: false,
  });
  await queryInterface.removeColumn('audio', 'audio_time');
}

export {
  up,
};
