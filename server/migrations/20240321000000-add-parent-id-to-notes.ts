import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn('notes', 'parentId', {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'notes',
        key: 'id',
      },
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('notes', 'parentId');
  },
}; 