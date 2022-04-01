module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Invoice', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      description: {
        allowNull: true,
        type: Sequelize.STRING,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      totalAmount: {
        allowNull: false,
        type: Sequelize.FLOAT,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      date: {
        allowNull: false,
        type: Sequelize.DATE,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      paymentType: {
        allowNull: false,
        type: Sequelize.ENUM('PROGRESS', 'FINAL PAYMENT', 'DEPOSIT'),
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      productionId: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: {
          model: 'Production',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    });
  },
  down: async (queryInterface, _Sequelize) => {
    await queryInterface.dropTable('Invoice');
  },
};
