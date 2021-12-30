'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('EmployeeAccount', {
      email: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'account',
          key: 'email',
        },
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      hourlyWage: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      supervisorEmail: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: 'account',
          key: 'email',
        },
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('EmployeeAccount');
  },
};
