import { DataTypes, Sequelize } from 'sequelize';

export default function initUserModel(sequelize: Sequelize) {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hashPassword: {
        type: DataTypes.STRING,
      },
      signinAt: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: 'user',
      underscored: true,
    }
  );
  return User;
};
