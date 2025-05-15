import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

// General API rate limiter
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});

// Authentication rate limiter (more strict)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many login attempts, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});

// Note creation rate limiter
export const noteCreationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50, // limit each IP to 50 note creations per hour
    message: 'Too many notes created, please try again after an hour',
    standardHeaders: true,
    legacyHeaders: false,
});

// Search rate limiter
export const searchLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // limit each IP to 30 search requests per minute
    message: 'Too many search requests, please try again after a minute',
    standardHeaders: true,
    legacyHeaders: false,
}); 