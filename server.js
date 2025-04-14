import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { createServer } from 'http';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

import authRouter from './routes/auth.js';
import userRouter from './routes/user.js';
import driverRouter from './routes/driver.js';
import initializeSocket from './socket/order/order.js';

dotenv.config();

const app = express();
const server = createServer(app);

// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = [
  'https://precisoweb-frontend.onrender.com/',
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Initialize Socket.IO
initializeSocket(server);

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

// API Routes
app.get("/api", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/driver", driverRouter);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
  });
}

// Start server
const PORT = process.env.SERVER_PORT || 4000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
