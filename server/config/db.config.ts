/**
 * Database configuration using Sequelize for MySQL
 */

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

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
    logging: false,
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
      bigNumberStrings: true      // Return BIGINT as strings
    }
  }
);

/**
 * Test database connection
 * Logs success or failure of database connection
 */
sequelize.authenticate()
  .then(() => console.log('DB connected'))
  .catch(console.error);

export default sequelize; 