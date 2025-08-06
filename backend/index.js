import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/database.js';
import { inngest, functions } from "./inngest/index.js"
import { serve } from "inngest/express";

const app = express();
await connectDB()

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Social App Backend!');
});

app.use("/api/inngest", serve({ client: inngest, functions }));


app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});