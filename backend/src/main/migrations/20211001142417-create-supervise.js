'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Supervise', {
      supervisorEmail: {
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
      employeeEmail: {
        allowNull: false,
        primaryKey: false,
        type: Sequelize.STRING,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'account',
          key: 'email',
        },
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Supervise');
  },
};
