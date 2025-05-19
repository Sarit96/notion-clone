import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Set allowed origins based on environment
const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [process.env.FRONTEND_URL] // Production frontend URL
    : ['http://localhost:3000']; // Development frontend URL

// CORS configuration options
const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        // Allow requests from allowed origins
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'x-google-user'], // Allowed headers
    credentials: true, // Allow credentials (cookies, auth headers)
    exposedHeaders: ['Authorization'], // Headers exposed to the client
    maxAge: 86400 // 24 hours
};

export default corsOptions; 