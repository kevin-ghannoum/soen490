'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('EmployeeHoursInputType', {
      email: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model:'employeeAccount',
          key:'email'
        }
      },
      automatic: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      scheduledDay: {
        allowNull: true,
        type:Sequelize.ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'),
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('EmployeeHoursInputType');
  }
};