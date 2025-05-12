/**
 * Authentication Middleware
 * Handles JWT token verification and user authentication
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// JWT payload structure
interface JwtPayload {
  userId: number;
  email: string;
}

// Extended Request type with user information
interface CustomRequest extends Request {
  user?: JwtPayload;
}

/**
 * Verify JWT token and attach user info to request
 * Returns 401 if no token, 400 if invalid token
 */
export const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction): void => {
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