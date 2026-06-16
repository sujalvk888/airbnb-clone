// server/index.js

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import 'dotenv/config';

import { prisma } from './db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Trust Proxy (Crucial for Render/Railway to read client IPs correctly)
app.set('trust proxy', 1);

// 2. HTTP Header Security
app.use(helmet());

// 3. Disable Express Fingerprinting (Helmet does this, but this is an explicit safeguard)
app.disable('x-powered-by');

// 4. Strict CORS Configuration
const corsOptions = {
  origin: process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',')
    : ['http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// 5. JSON Body Parser
app.use(express.json());

// 6. Global Rate Limiting (Environment Aware)
// Uses strict limits in production, but relaxed limits for local HMR development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 3000, 
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' },
  standardHeaders: true, 
  legacyHeaders: false,
});

// Apply limiter globally to all API routes
app.use('/api/', limiter);

// --- ROUTES ---

app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'OK', message: 'Production server running and DB connected securely.' });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: 'Database connection failed.' });
  }
});

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went terribly wrong!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Production-ready server actively listening on port ${PORT}`);
});