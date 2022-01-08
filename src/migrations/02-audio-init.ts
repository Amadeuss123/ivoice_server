import { DataTypes, QueryInterface } from 'sequelize';

async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable('audio', {
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
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    audio_time: {
      type: DataTypes.FLOAT,
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

  await queryInterface.addConstraint('audio', {
    fields: ['user_id'],
    type: 'foreign key',
    name: 'audio_user_id_key',
    references: {
      table: 'user',
      field: 'id',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
}

export {
  up,
};
