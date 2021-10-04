'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Task', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('NEW', 'ACTIVE', 'RESOLVED', 'CLOSED', 'REMOVED'),
        defaultValue: 'NEW'
      },
      deadlineDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      createdDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      modifiedDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      projectId: {
        allowNull: false,
        type: Sequelize.BIGINT,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model:'project',
          key:'id'
        }
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Task');
  }
};