const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env file FIRST
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:1127',  // only allow requests from your Vite frontend
  credentials: true
}));
app.use(express.json());  // lets Express read JSON request bodies

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/assessment', require('./routes/assessment'));

// Health check route (open in browser to verify server is running)
app.get('/', (req, res) => {
  res.json({ message: 'AidSphere API is running' });
});

// Start server
const PORT = process.env.PORT || 2310;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});