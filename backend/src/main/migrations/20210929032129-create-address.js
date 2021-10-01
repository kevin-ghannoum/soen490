'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Address', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.BIGINT
      },
      civicNumber: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      streetName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      postalCode: {
        allowNull: false,
        type: Sequelize.STRING
      },
      cityName:{
        allowNull: false,
        type: Sequelize.STRING
      },
      province:{
        allowNull: false,
        type: Sequelize.STRING
      },
      country:{
        allowNull: false,
        type: Sequelize.STRING
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Address');
  }
};