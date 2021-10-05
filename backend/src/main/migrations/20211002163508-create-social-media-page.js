'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SocialMediaPage', {
      link: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.STRING,
      },
      name: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.STRING,
      },
      email: {
        allowNull: true,
        type: Sequelize.STRING,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'clientaccount',
          key: 'email',
        },
      },
      businessId: {
        allowNull: true,
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
    await queryInterface.dropTable('SocialMediaPage');
  },
};
