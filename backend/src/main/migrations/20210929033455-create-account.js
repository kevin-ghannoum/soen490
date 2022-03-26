'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Account', {
      email: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      firstName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      lastName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      phoneNumber: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      username: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      addressId: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: {
          model: 'Address',
          key: 'id',
        },
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Account');
  },
};
