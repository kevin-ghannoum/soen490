
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("call", "action", {
      type: Sequelize.ENUM("CALLED", "NO ANSWER", "LEFT VOICEMAIL", "EMAIL SENT", "FOLLOW UP", "CALL BACK", "WILL CALL BACK", "ESTIMATE BOOKED"),
      allowNull: false,
    });

    await queryInterface.addColumn("call", "followUp", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    });
    await queryInterface.addColumn("call", "neverCallBack", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    });

    await queryInterface.addColumn("call", "callerEmail", {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'account',
        key: 'email',
      },
    });


  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("call", "action");
    await queryInterface.removeColumn("call", "followUp");
    await queryInterface.removeColumn("call", "neverCallBack");
    await queryInterface.removeColumn("call", "callerEmail");
  }
};
