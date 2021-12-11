import { DataTypes, Sequelize } from 'sequelize';

export default function initUsersModel(sequelize: Sequelize) {
  const Users = sequelize.define(
    'Users',
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
      tableName: 'users',
      underscored: true,
    }
  );
  return Users;
};
