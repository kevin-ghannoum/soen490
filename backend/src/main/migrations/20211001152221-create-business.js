module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Business', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.BIGINT,
      },
      name: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      industry: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      website: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      email: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'businessaccount',
          key: 'email'
        }
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Business');
  },
};
