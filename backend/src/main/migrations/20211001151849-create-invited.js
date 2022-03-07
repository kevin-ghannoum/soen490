'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Invited', {
      status: {
        allowNull: false,
        type: Sequelize.ENUM('ACCEPTED', 'REJECTED', 'PENDING'),
      },
      email: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'Account',
          key: 'email',
        },
      },
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.BIGINT,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'Event',
          key: 'id',
        },
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Invited');
  },
};
