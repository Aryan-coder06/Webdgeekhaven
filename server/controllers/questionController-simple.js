import Question from "../models/Question.js";
import Category from "../models/Category.js";

export const getAllQuestions = async (req, res) => {
  try {
    console.log('📋 GET /api/questions - Fetching all questions');
    const questions = await Question.find();
    console.log(`📋 Found ${questions.length} questions`);
    
    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    console.error('Error in getAllQuestions:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const searchQuestions = async (req, res) => {
  try {
    console.log('🔍 Search request received:', req.query);
    const { search, tags } = req.query;
    let query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    console.log('🔍 Search query:', query);
    const questions = await Question.find(query);
    console.log(`🔍 Found ${questions.length} questions`);

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    console.error('Error in searchQuestions:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
