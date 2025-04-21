import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import promisePool from './config/db.config.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection
const testConnection = async () => {
  try {
    const [rows] = await promisePool.query('SELECT 1');
    console.log('Database connection successful!');
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
};

// Initialize database and tables
const initializeDatabase = async () => {
  try {
    // Create database if not exists
    await promisePool.query('CREATE DATABASE IF NOT EXISTS auth_db');
    console.log('Database created or already exists');

    // Switch to auth_db
    await promisePool.query('USE auth_db');
    console.log('Switched to auth_db');
    
    // Create users table
    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Users table created or verified successfully');

    // Verify table structure
    const [columns] = await promisePool.query('DESCRIBE users');
    console.log('Table structure:', columns.map(col => `${col.Field} (${col.Type})`).join(', '));
    
  } catch (error) {
    console.error('Database initialization error:', error.message);
    process.exit(1); // Exit if database initialization fails
  }
};

// Call initialization immediately
initializeDatabase();

// Verify database structure
const verifyDatabaseStructure = async () => {
  try {
    // Check database exists
    const [databases] = await promisePool.query('SHOW DATABASES LIKE ?', ['auth_db']);
    if (databases.length > 0) {
      console.log('✓ Database "auth_db" exists');
      
      // Switch to auth_db
      await promisePool.query('USE auth_db');
      
      // Check users table structure
      const [columns] = await promisePool.query('DESCRIBE users');
      console.log('\nUsers table structure:');
      columns.forEach(column => {
        console.log(`${column.Field}: ${column.Type} ${column.Null === 'NO' ? 'NOT NULL' : ''} ${column.Key === 'PRI' ? 'PRIMARY KEY' : ''} ${column.Extra}`);
      });
      
      // Test insert and select
      const testUser = {
        username: 'test_user',
        email: 'test@example.com',
        password: 'test_password'
      };
      
      // Try to delete test user if exists
      await promisePool.query('DELETE FROM users WHERE email = ?', [testUser.email]);
      
      // Insert test user
      const [insertResult] = await promisePool.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [testUser.username, testUser.email, testUser.password]
      );
      console.log('\n✓ Test user inserted successfully with ID:', insertResult.insertId);
      
      // Select test user
      const [users] = await promisePool.query('SELECT * FROM users WHERE email = ?', [testUser.email]);
      console.log('✓ Test user retrieved successfully:', users[0].username);
      
      // Clean up - delete test user
      await promisePool.query('DELETE FROM users WHERE email = ?', [testUser.email]);
      console.log('✓ Test user cleaned up successfully');
      
    } else {
      console.error('Database "auth_db" does not exist!');
    }
  } catch (error) {
    console.error('Verification failed:', error.message);
  }
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Protected route example
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const [users] = await promisePool.query(
      'SELECT id, username, email, created_at FROM users WHERE id = ?',
      [req.user.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Register route
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Debug log
    console.log('Received registration request:', { username, email });

    // Validate input
    if (!username || !email || !password) {
      console.log('Missing required fields:', { username: !!username, email: !!email, password: !!password });
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const [existingUsers] = await promisePool.query(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existingUsers.length > 0) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log('Attempting to insert new user:', email);

    // Insert new user
    const [result] = await promisePool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    console.log('User inserted successfully:', result.insertId);

    // Generate JWT token
    const token = jwt.sign(
      { userId: result.insertId, email: email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send response
    res.status(201).json({
      token,
      user: {
        id: result.insertId,
        username,
        email
      }
    });
  } catch (error) {
    console.error('Registration error details:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      details: error.message 
    });
  }
});

// Login route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Get user from database
    const [users] = await promisePool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = users[0];

    // Compare password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send response
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the authentication API' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  testConnection();
  verifyDatabaseStructure();
}); 