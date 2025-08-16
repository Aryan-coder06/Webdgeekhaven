import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// API calls
export const questionsAPI = {
  // Get all questions
  getAllQuestions: async () => {
    try {
      const response = await api.get('/questions');
      return response.data;
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  },

  // Search questions
  searchQuestions: async (query) => {
    try {
      const response = await api.get(`/questions/search?search=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching questions:', error);
      throw error;
    }
  },

  // Get all categories
  getAllCategories: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
};

export default api;
