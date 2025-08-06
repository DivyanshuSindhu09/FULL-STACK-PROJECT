import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/database.js';
import { inngest, functions } from "./inngest/index.js"
import { serve } from "inngest/express";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to DB
connectDB().catch((err) => {
  console.error("DB connection failed:", err);
});

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Social App Backend!');
});

app.use("/api/inngest", serve({ client: inngest, functions }));

// ❌ DO NOT use app.listen()
// ✅ Instead, export the app
export default app;
