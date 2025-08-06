import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { inngest, functions } from "./inngest/index.js"
import { serve } from "inngest/express";
import connectDB from './config/database.js';
import { clerkMiddleware } from '@clerk/express'

const app = express();

connectDB()

// Middlewares
app.use(cors());
app.use(express.json());
app.user(clerkMiddleware())
//! this middleware will add auth property when the user is authenticated

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Social App Backend!');
});

app.use("/api/inngest", serve({ client: inngest, functions }));


export default app;
