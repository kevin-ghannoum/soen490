'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Project', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM('BOOKED', 'PENDING', 'REJECTED', 'TO BE RESCHEDULED', 'COMPLETED')
      },
      serviceType: {
        type: Sequelize.STRING
      },
      leadSource: {
        type: Sequelize.STRING
      },
      leadCredit: {
        type: Sequelize.STRING
      },
      leadRanking: {
        type: Sequelize.STRING
      },
      createdDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deadlineDate: {
        type: Sequelize.DATE
      },
      followUpDate: {
        type: Sequelize.DATE
      },
      modifiedDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      extraNotes: {
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'account',
          key: 'email'
        }
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Project');
  }
};