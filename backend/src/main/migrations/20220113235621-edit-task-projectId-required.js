'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Task', 'projectId', {
      allowNull: true,
      type: Sequelize.BIGINT,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: {
        model: 'project',
        key: 'id'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Task', 'projectId', {
      allowNull: false,
      type: Sequelize.BIGINT,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: {
        model: 'project',
        key: 'id'
      }
    });
  }
};
