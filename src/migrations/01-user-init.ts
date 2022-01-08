import Config from "@lib/config";
import AppLogger from "@lib/log/logger";
import { QueryInterface, DataTypes } from "sequelize";

async function up(queryInterface: QueryInterface, config: Config, appLog: AppLogger) {
  await queryInterface.createTable(
    'user',
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hash_password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      signin_at: {
        type: DataTypes.DATE,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      uniqueKeys: {
        users_phone: {
          fields: ['phone'],
        },
      },
    }
  );
}

export {
  up,
};
