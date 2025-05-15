import { QueryInterface, DataTypes } from 'sequelize';

const migration = {
    up: async (queryInterface: QueryInterface) => {
        // First check if the column already exists
        const tableInfo = await queryInterface.describeTable('notes');
        if (!tableInfo.parentId) {
            await queryInterface.addColumn('notes', 'parentId', {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'notes',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            });
        }
    },

    down: async (queryInterface: QueryInterface) => {
        // Only remove if it exists
        const tableInfo = await queryInterface.describeTable('notes');
        if (tableInfo.parentId) {
            await queryInterface.removeColumn('notes', 'parentId');
        }
    }
};

export default migration; 