'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Notification', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      date: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      message: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM('EVENT', 'SYSTEM', 'REMINDER', 'GENERAL'),
      },
      email: {
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
    await queryInterface.dropTable('Notification');
  },
};
