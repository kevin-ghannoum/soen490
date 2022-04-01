'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('EmployeeAccount', {
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
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      hourlyWage: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      supervisorEmail: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: 'Account',
          key: 'email'
        }
      },
      businessId:{
        allowNull:false,
        type: Sequelize.BIGINT,
        references:{
          model: 'Business',
          key:'id'
        }
      }
    });
  },
  down: async (queryInterface, _Sequelize) => {
    await queryInterface.dropTable('EmployeeAccount');
  },
};
