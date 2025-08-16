import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Category from "./models/Category.js";
import Question from "./models/Question.js";

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    await Category.deleteMany();
    await Question.deleteMany();

    const res = await fetch("https://test-data-gules.vercel.app/data.json");
    const jsonData = await res.json();

    for (let cat of jsonData.data) {
  let questionIds = [];

  for (let q of cat.ques) {
    if (!q.title) {
      console.warn("⚠️ Skipping question without title:", q);
      continue;
    }

    const newQuestion = await Question.create({
      title: q.title,
      url: {
        yt_link: q.yt_link || "",
        p1_link: q.p1_link || "",
        p2_link: q.p2_link || ""
      },
      tags: q.tags ? q.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
    });

    questionIds.push(newQuestion._id);
  }

  await Category.create({
    title: cat.title,
    questions: questionIds
  });
}


    console.log("Database Seeded Successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Seeder Error:", err);
    process.exit(1);
  }
};

seedData();
