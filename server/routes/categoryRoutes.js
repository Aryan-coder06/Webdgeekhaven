import express from 'express';
import { getAllCategories, searchQuestions } from '../controllers/categoryController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllCategories);
router.get('/search', searchQuestions);

export default router;