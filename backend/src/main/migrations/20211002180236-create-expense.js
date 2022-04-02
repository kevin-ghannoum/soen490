module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Expense', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.BIGINT,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'Transaction',
          key: 'id',
        },
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM('WAGES', 'TOOLS', 'OTHER'),
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    });
  },
  down: async (queryInterface, _Sequelize) => {
    await queryInterface.dropTable('Expense');
  },
};
