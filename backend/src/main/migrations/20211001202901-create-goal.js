module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Goal', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      value: {
        allowNull: false,
        type: Sequelize.FLOAT,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM('SALES', 'EXPENSES'),
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      deadline: {
        type: Sequelize.DATE,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      businessId: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: {
          model: 'business',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Goal');
  },
};
