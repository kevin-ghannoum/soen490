'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Feedback', {
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
      comment: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      rating: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      projectId: {
        allowNull: false,
        type: Sequelize.BIGINT,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'Project',
          key: 'id',
        },
      },
    });
  },
  down: async (queryInterface, _Sequelize) => {
    await queryInterface.dropTable('Feedback');
  },
};
