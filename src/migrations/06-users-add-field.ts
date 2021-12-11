import Sequelize, { QueryInterface } from 'sequelize';

async function up(queryInterface: QueryInterface) {
  await queryInterface.addColumn('users', 'signin_at', {
    type: Sequelize.DATE,
  });
}

export {
  up,
};
