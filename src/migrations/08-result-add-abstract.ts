import { DataTypes, QueryInterface } from 'sequelize';

async function up(queryInterface: QueryInterface) {
  await queryInterface.addColumn('result', 'abstract', {
    type: DataTypes.STRING,
  });
}

export {
  up,
};
