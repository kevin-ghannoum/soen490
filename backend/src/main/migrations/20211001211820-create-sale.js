module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Sale', {
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
      amount: {
        allowNull: false,
        type: Sequelize.FLOAT,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      dueDate: {
        allowNull: false,
        type: Sequelize.DATE,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      createdDate: {
        allowNull: false,
        type: Sequelize.DATE,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      projectId: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: {
          model: 'project',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Sale');
  },
};
