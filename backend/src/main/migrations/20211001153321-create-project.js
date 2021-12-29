'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Project', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      description: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM(
          'BOOKED',
          'PENDING',
          'REJECTED',
          'TO BE RESCHEDULED',
          'ARCHIVED'
        ),
      },
      serviceType: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      leadSource: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      leadCredit: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      leadRanking: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      createdDate: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deadlineDate: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      followUpDate: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      modifiedDate: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      extraNotes: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'account',
          key: 'email'
        }
      },
      businessId: {
        allowNull: false,
        type: Sequelize.BIGINT,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'business',
          key: 'id',
        },
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Project');
  },
};
