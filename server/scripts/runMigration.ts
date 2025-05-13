import sequelize from '../config/db.config';
import { QueryInterface } from 'sequelize';
import migration from '../migrations/20240313_add_google_id';

async function runMigration() {
    try {
        const queryInterface: QueryInterface = sequelize.getQueryInterface();
        await migration.up(queryInterface);
        console.log('Migration completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

runMigration(); 