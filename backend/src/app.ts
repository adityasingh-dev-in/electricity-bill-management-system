import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

//routes imports
import authRouter from './routes/auth.route'
import userRoute from './routes/user.route'
import consumerRoute from './routes/consumer.route'
import tariffRoute from './routes/tariff.route'
import meterReadingRoute from './routes/meterReading.route'
import billRoute from './routes/bill.route'
import paymentRoute from './routes/payment.route'
import complaintRoute from './routes/complaint.route'

import { errorHandler } from './middlewares/error.middleware';

const app = express();

// 1. Improved CORS configuration
const allowedOrigins = [
  process.env.CORS_ORIGIN,
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean) as string[]; 

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.set('trust proxy', 1);

// 2. Parsers with limits
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); // Useful for Multer temp files
app.use(cookieParser());

// 3. Health Check Route (Good for Load Balancers/Docker)
app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok", uptime: process.uptime() });
});


// 4. Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/consumer", consumerRoute);
app.use("/api/v1/tariff", tariffRoute);
app.use("/api/v1/meter-reading", meterReadingRoute);
app.use("/api/v1/bill", billRoute);
app.use("/api/v1/payment", paymentRoute);
app.use('/api/v1/complaint',complaintRoute)


// 5. Root Route
app.get("/", (req: Request, res: Response) => {
    res.send("API is running...");
});

// Global Error Handler
app.use(errorHandler);

export default app;
