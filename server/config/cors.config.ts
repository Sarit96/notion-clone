import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [process.env.FRONTEND_URL] // Production frontend URL
    : ['http://localhost:3000']; // Development frontend URL

const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'x-google-user'],
    credentials: true,
    exposedHeaders: ['Authorization'],
    maxAge: 86400 // 24 hours
};

export default corsOptions; 