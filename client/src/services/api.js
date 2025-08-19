import axios from 'axios';

const API_BASE_URL = 'https://webdgeekhaven.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const questionsAPI = {
  getAllQuestions: async () => {
    try {
      const response = await api.get('/questions');
      return response.data;
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  },

  searchQuestions: async (query) => {
    try {
      const response = await api.get(`/questions/search?search=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching questions:', error);
      throw error;
    }
  },

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
