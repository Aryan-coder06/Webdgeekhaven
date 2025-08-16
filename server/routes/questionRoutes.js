import express from "express";
import {
  getAllQuestions,
  searchQuestions
} from "../controllers/questionController.js";

const router = express.Router();

// Public routes
router.get("/", getAllQuestions);
router.get("/search", searchQuestions);

export default router;
