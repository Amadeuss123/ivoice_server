import { DataTypes, QueryInterface } from 'sequelize';
import { addOrReplaceIndex } from '../lib/migrator/migration-utils';

async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable('cache', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    data: {
      type: DataTypes.JSON,
    },
    expire_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  await addOrReplaceIndex(queryInterface, 'cache', 'cache_expire_date', [
    'expire_date',
  ]);
}

export {
  up,
};
