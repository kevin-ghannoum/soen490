'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('Task', 'status', {
        type: Sequelize.ENUM('NEW', 'ACTIVE', 'RESOLVED', 'CLOSED', 'REMOVED', 'COMPLETE'),
        defaultValue: 'NEW',
      }),
    ]);
    
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.changeColumn('Task', 'status')]);
  },
};
