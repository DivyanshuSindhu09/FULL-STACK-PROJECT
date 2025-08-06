import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/database.js';

const app = express();
await connectDB()

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Social App Backend!');
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});