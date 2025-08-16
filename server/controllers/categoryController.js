import Category from '../models/Category.js';
import Question from '../models/Question.js';

export const searchQuestions = async (req, res) => {
  try {
    const { search } = req.query;
    
    const questions = await Question.find({
      title: { $regex: search, $options: 'i' }
    }).populate({
      path: 'category',
      select: 'title'
    });
    
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate('questions');
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};