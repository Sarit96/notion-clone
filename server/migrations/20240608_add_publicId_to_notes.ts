import { QueryInterface, DataTypes } from 'sequelize';

const migration = {
    up: async (queryInterface: QueryInterface) => {
        const tableInfo = await queryInterface.describeTable('notes');
        if (!tableInfo.publicId) {
            await queryInterface.addColumn('notes', 'publicId', {
                type: DataTypes.STRING(64),
                allowNull: true,
                unique: true
            });
        }
    },

    down: async (queryInterface: QueryInterface) => {
        const tableInfo = await queryInterface.describeTable('notes');
        if (tableInfo.publicId) {
            await queryInterface.removeColumn('notes', 'publicId');
        }
    }
};

export default migration; 