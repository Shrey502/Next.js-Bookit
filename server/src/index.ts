// server/src/index.ts

import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import apiRoutes from './routes/api.routes'; // <-- 1. IMPORT YOUR ROUTES

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app: Express = express();
const PORT = process.env.PORT || 5001;

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- Simple Test Route ---
app.get('/', (req: Request, res: Response) => {
  res.send('BookIt API is running...');
});

// --- API Routes ---
// This tells Express to use your new routes.
// All routes in api.routes.ts will be prefixed with /api
app.use('/api', apiRoutes); // <-- 2. ADD THIS LINE

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});