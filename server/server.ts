/**
 * Server Configuration and API Routes
 * This file sets up the Express server with authentication, rate limiting,
 * and API endpoints for user management and notes.
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { body, validationResult, ValidationChain } from 'express-validator';
import { models, syncDatabase } from './models';
import noteRoutes from './routes/noteRoutes';
import { Op } from 'sequelize';

// Load environment variables from .env file
dotenv.config();

/**
 * Type Definitions
 * JwtPayload: Structure of the JWT token payload
 * CustomRequest: Extended Express Request type with user information
 */
interface JwtPayload {
  userId: number;
  email: string;
}

interface CustomRequest extends Request {
  user?: JwtPayload;
}

// Initialize Sequelize models
const { User, Note } = models;

// Create Express application
const app = express();

/**
 * Security Middleware
 * helmet: Adds various HTTP headers for security
 * cors: Configures Cross-Origin Resource Sharing
 */
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'x-google-user'],
  credentials: true,
  exposedHeaders: ['Authorization']
}));

// Parse JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Rate Limiting
 * Limits authentication attempts to prevent brute force attacks
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again after 15 minutes'
});

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user information to request
 */
const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Access denied. No token provided.' });
    return;
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || '') as JwtPayload;
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

/**
 * Input Validation Middleware
 * Validates user input for registration and login
 */
const validateRegistration: ValidationChain[] = [
  body('username').trim().isLength({ min: 3, max: 30 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
];

const validateLogin: ValidationChain[] = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

/**
 * Error Handling Middleware
 * Processes validation errors and sends appropriate response
 */
const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

/**
 * API Routes
 */

// Get user profile (protected route)
app.get('/api/profile', authenticateToken, async (req: CustomRequest, res: Response) => {
  try {
    const user = await User.findByPk(req.user?.userId, {
      attributes: ['id', 'username', 'email', 'createdAt']
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// User registration
app.post('/api/auth/register', validateRegistration, handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || '',
      { expiresIn: '24h' }
    );

    res.status(201).json({ token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error during registration' });
  }
});

// User login
app.post('/api/auth/login', validateLogin, handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email with all attributes (including password)
    const user = await User.findOne({ 
      where: { email }
    });

    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || '',
      { expiresIn: '24h' }
    );

    // Send response with user data (excluding password)
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login' });
  }
});

// Google login endpoint
app.post('/api/auth/google', async (req: Request, res: Response) => {
  try {
    const { email, name, picture, id } = req.body;

    // Find user by email
    let user = await User.findOne({ where: { email } });

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        username: email.split('@')[0],
        email,
        password: '', // Empty password for Google users
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || '',
      { expiresIn: '24h' }
    );

    // Send response with user data
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: 'Error during Google login' });
  }
});

// Mount note routes
app.use('/api/notes', noteRoutes);

/**
 * Global Error Handler
 * Catches any unhandled errors and sends appropriate response
 */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

/**
 * Server Initialization
 * Syncs database and starts the server
 */
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await syncDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer(); 