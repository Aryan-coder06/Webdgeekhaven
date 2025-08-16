import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running without DB' });
});

// Mock questions endpoint
app.get('/api/questions/search', (req, res) => {
  const { search } = req.query;
  console.log('Search query received:', search);
  
  // Mock data for testing
  const mockQuestions = [
    { _id: '1', title: 'Introduction to LinkedList' },
    { _id: '2', title: 'LinkedList Traversal' },
    { _id: '3', title: 'Array Operations' }
  ];
  
  const filteredQuestions = search 
    ? mockQuestions.filter(q => q.title.toLowerCase().includes(search.toLowerCase()))
    : mockQuestions;
  
  res.json({
    success: true,
    count: filteredQuestions.length,
    data: filteredQuestions
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Minimal server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
