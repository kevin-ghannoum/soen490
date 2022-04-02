
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Call", "action", {
      type: Sequelize.ENUM("CALLED", "NO ANSWER", "LEFT VOICEMAIL", "EMAIL SENT", "FOLLOW UP", "CALL BACK", "WILL CALL BACK", "ESTIMATE BOOKED"),
      allowNull: false,
    });

    await queryInterface.addColumn("Call", "followUp", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    });
    await queryInterface.addColumn("Call", "neverCallBack", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    });

    await queryInterface.addColumn("Call", "callerEmail", {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'Account',
        key: 'email',
      },
    });
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.removeColumn("call", "action");
    await queryInterface.removeColumn("call", "followUp");
    await queryInterface.removeColumn("call", "neverCallBack");
    await queryInterface.removeColumn("call", "callerEmail");
  }
};
