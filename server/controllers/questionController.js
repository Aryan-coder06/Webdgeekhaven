import Question from "../models/Question.js";

export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const searchQuestions = async (req, res) => {
  try {
    const { search } = req.query;
    const query = search ? { title: { $regex: search, $options: 'i' } } : {};
    const questions = await Question.find(query);
    res.json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
