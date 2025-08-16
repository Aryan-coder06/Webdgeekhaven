import express from 'express';
import mongoose from 'mongoose';
import config from './config/env.js';
import Question from './models/Question.js';
import Category from './models/Category.js';
import cors from 'cors';

// Initialize Express
const app = express();
const PORT = config.port;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route that doesn't depend on DB
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Configure routes - defined before DB connection
app.get('/api/questions', async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        success: false,
        message: 'Database connection not ready'
      });
    }
    
    const questions = await Question.find();
    res.json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/questions/search', async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        success: false,
        message: 'Database connection not ready'
      });
    }
    
    const { search } = req.query;
    console.log('Search query received:', search);
    
    const query = search ? { title: { $regex: search, $options: 'i' } } : {};
    const questions = await Question.find(query);
    
    console.log(`Found ${questions.length} questions`);
    res.json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    console.error('Error searching questions:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        success: false,
        message: 'Database connection not ready'
      });
    }
    
    const categories = await Category.find().populate('questions');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server immediately - don't wait for DB connection
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

// Connect to MongoDB with timeout options
const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(config.mongodb_url, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      connectTimeoutMS: 10000      // 10 second timeout
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Don't exit the process - the server is already running
  }
};

// Connect to DB but don't block server startup
connectDB();

// Handle server shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});
