import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { inngest, functions } from "./inngest/index.js"
import { serve } from "inngest/express";
import connectDB from './config/database.js';
import { clerkMiddleware } from '@clerk/express'
import userRouter from './routes/user.routes.js';
import postRouter from './routes/post.routes.js';

const app = express();

connectDB()

// Middlewares
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware())
//! this middleware will add auth property when the user is authenticated

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Social App Backend!');
});

app.use("/api/inngest", serve({ client: inngest, functions }));

app.use('/api/user', userRouter)
app.use('/api/post', postRouter)

export default app;
