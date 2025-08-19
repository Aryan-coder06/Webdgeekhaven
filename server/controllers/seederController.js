import axios from 'axios';
import Category from '../models/Category.js';
import Question from '../models/Question.js';

export const seedDatabase = async (req, res) => {
  try {
    console.log('🌱 Starting database seeding...');
    
    await Category.deleteMany();
    await Question.deleteMany();
    console.log('🧹 Cleared existing data');
    
    const { data } = await axios.get('https://test-data-gules.vercel.app/data.json');
    
    for (const categoryData of data.data) {
      const questions = [];
      
      for (const q of categoryData.ques) {
        if (!q.title || q.title === null || q.title === undefined || 
            (typeof q.title === 'string' && q.title.trim() === '')) {
          console.warn('⚠️ Skipping question without title:', JSON.stringify(q));
          continue;
        }
        
        const newQuestion = new Question({
          title: q.title.trim(),
          url: {
            yt_link: q.yt_link || '',
            p1_link: q.p1_link || '',
            p2_link: q.p2_link || ''
          },
          tags: q.tags ? q.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
        });
        
        const savedQuestion = await newQuestion.save();
        questions.push(savedQuestion._id);
      }
      if (questions.length > 0) {
        const newCategory = new Category({
          title: categoryData.title,
          questions
        });
        
        await newCategory.save();
        console.log(`✅ Created category: ${categoryData.title} with ${questions.length} questions`);
      } else {
        console.warn('⚠️ Skipping category with no valid questions:', categoryData.title);
      }
    }
    
    res.status(201).json({ 
      success: true,
      message: 'Database seeded successfully' 
    });
  } catch (error) {
    console.error('❌ Seeding error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};
