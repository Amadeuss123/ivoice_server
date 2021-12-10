const Sequelize = require('sequelize');

async function up(queryInterface) {
  await queryInterface.addColumn('users', 'signin_at', {
    type: Sequelize.DATE,
  });
}

module.exports = {
  up,
};
