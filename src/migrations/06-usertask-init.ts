import { DataTypes, QueryInterface } from 'sequelize';
import { TaskStatus } from 'src/const/task';

async function up(queryInterface: QueryInterface) {
  // await queryInterface.createTable('usertask', {
  //   user_id: {
  //     type: DataTypes.STRING,
  //     primaryKey: true,
  //   },
  //   task_id: {
  //     type: DataTypes.STRING,
  //     primaryKey: true,
  //   },
  //   task_status: {
  //     type: DataTypes.TINYINT,
  //     allowNull: false,
  //     defaultValue: TaskStatus.Waiting,
  //   }
  // });

  // await queryInterface.addConstraint('usertask', {
  //   fields: ['user_id'],
  //   type: 'foreign key',
  //   name: 'usertask_user_id_key',
  //   references: {
  //     table: 'user',
  //     field: 'id',
  //   },
  //   onDelete: 'cascade',
  //   onUpdate: 'cascade',
  // });

  // await queryInterface.addConstraint('usertask', {
  //   fields: ['task_id'],
  //   type: 'foreign key',
  //   name: 'usertask_task_id_key',
  //   references: {
  //     table: 'task',
  //     field: 'id',
  //   },
  //   onDelete: 'cascade',
  //   onUpdate: 'cascade',
  // })
}

module.exports = {
  up,
};
