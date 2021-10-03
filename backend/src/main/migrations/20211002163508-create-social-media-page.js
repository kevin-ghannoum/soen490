'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SocialMediaPage', {
      link: {
        primaryKey:true,
        allowNull: false,
        type: Sequelize.STRING
      },
      name: {
        primaryKey:true,
        allowNull: false,
        type: Sequelize.STRING
      },
      email:{
        allowNull:false,
        type:Sequelize.STRING,
        references:{
          model:'clientaccount',
          key:'email'
        }
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('SocialMediaPage');
  }
};