/**
 * Models Initialization
 * This file initializes Sequelize models and sets up their associations.
 * It also provides a function to sync the database schema with the models.
 */

import sequelize from '../config/db.config';
import User from './User';
import Note from './Note';

/**
 * Initialize models
 * Creates an object containing all models for easy access
 */
const models = {
  User,
  Note,
};

/**
 * Set up model associations
 * Iterates through all models and calls their associate method if it exists
 * This ensures all relationships between models are properly defined
 */
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

/**
 * Database Synchronization
 * - Tests the database connection
 * - Syncs all models with the database schema
 * - Uses force: true in development to recreate tables
 * - Uses alter: true in production to update existing tables
 * - Exits the process if synchronization fails
 */
const syncDatabase = async () => {
  try {
    // Test the connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync all models
    const isDevelopment = process.env.NODE_ENV !== 'production';
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error);
    process.exit(1);
  }
};

export { sequelize, models, syncDatabase }; 