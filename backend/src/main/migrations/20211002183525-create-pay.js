'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Pay', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      issueDate:{
        allowNull:false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      },
      hoursWorked:{
        allowNull:false,
        type:Sequelize.FLOAT
      },
      status:{
        allowNull:false,
        type:Sequelize.ENUM('PAID', 'NOT_PAID'),
        defaultValue:'NOT_PAID'
      },
      periodStart:{
        allowNull:false,
        type:Sequelize.STRING
      },
      periodEnd:{
        allowNull:false,
        type:Sequelize.STRING
      },
      email:{
        type:Sequelize.STRING,
        allowNull:false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references:{
          model:'employeeaccount',
          key:'email'
        },
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Pay');
  }
};