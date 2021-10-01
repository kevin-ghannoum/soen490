'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ClientAccount', {
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
      },
      businessName:{
        allowNull:false,
        type:Sequelize.STRING
      },
      industry:{
        allowNull:false,
        type:Sequelize.STRING
      },
      website:{
        allowNull:false,
        type:Sequelize.STRING
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM('LEAD', 'SCHEDULED', 'REJECTED', 'TO BE RESCHEDULED', 'PENDING'),
        defaultValue:'PENDING'
      },

    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ClientAccount');
  }
};