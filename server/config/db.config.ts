/**
 * Database configuration using Sequelize for MySQL
 */

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Log the database configuration (without password)
console.log('Database Configuration:', {
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  dialect: 'mysql'
});

/**
 * Create Sequelize instance with MySQL configuration
 * - Uses environment variables for database credentials
 * - Configures connection pooling for better performance
 * - Sets up proper type handling for large numbers
 * - Disables logging in production
 */
const sequelize = new Sequelize(
  process.env.DB_NAME || 'auth_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: (msg) => console.log('[Sequelize]', msg), // Enable logging for debugging
    define: {
      timestamps: true,    // Adds createdAt and updatedAt fields
      underscored: true,   // Uses snake_case for column names
    },
    pool: {
      max: 5,             // Maximum number of connections in pool
      min: 0,             // Minimum number of connections in pool
      acquire: 30000,     // Maximum time to acquire connection
      idle: 10000         // Maximum time connection can be idle
    },
    dialectOptions: {
      supportBigNumbers: true,    // Support for BIGINT
      bigNumberStrings: true,     // Return BIGINT as strings
      connectTimeout: 60000       // Increase connection timeout to 60 seconds
    }
  }
);

/**
 * Test database connection
 * Logs success or failure of database connection
 */
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');

    // Test if database exists
    const [results] = await sequelize.query('SELECT DATABASE() as current_db');
    console.log('Current database:', results[0]);

    return true;
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    return false;
  }
};

// Test connection and sync models
testConnection()
  .then(async (isConnected) => {
    if (isConnected) {
      try {
        await sequelize.sync();
        console.log('✅ All models were synchronized successfully.');
      } catch (error) {
        console.error('❌ Error synchronizing models:', error);
      }
    }
  })
  .catch(console.error);

export default sequelize; 