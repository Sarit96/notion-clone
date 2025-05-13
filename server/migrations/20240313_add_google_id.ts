import { QueryInterface, DataTypes } from 'sequelize';

const migration = {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.addColumn('users', 'googleId', {
            type: DataTypes.STRING(255),
            allowNull: true,
            unique: true
        });
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.removeColumn('users', 'googleId');
    }
};

export default migration; 