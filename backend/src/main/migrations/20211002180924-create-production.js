module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Production', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.BIGINT,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'transaction',
          key: 'id',
        },
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Production');
  },
};
