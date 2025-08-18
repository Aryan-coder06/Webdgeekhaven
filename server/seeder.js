import mongoose from "mongoose";
import dotenv from "dotenv";
import config from "./config/env.js";
import Category from "./models/Category.js";
import Question from "./models/Question.js";

dotenv.config();

// Connect to MongoDB directly
const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(config.mongodb_url, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 15000
    });
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing existing data...');
    await Category.deleteMany();
    await Question.deleteMany();
    console.log('✅ Existing data cleared');

    console.log('🌐 Fetching data from external API...');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout
    
    const res = await fetch("https://test-data-gules.vercel.app/data.json", {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const jsonData = await res.json();
    console.log(`📊 Fetched ${jsonData.data?.length || 0} categories`);

    if (!jsonData.data || jsonData.data.length === 0) {
      throw new Error('No data received from API');
    }

    let totalQuestions = 0;
    let totalCategories = 0;

    for (let cat of jsonData.data) {
      if (!cat.title) {
        console.warn(`⚠️ Skipping category without title:`, cat);
        continue;
      }

      let questionIds = [];

      for (let q of cat.ques) {
        if (!q.title) {
          console.warn(`⚠️ Skipping question without title in category "${cat.title}":`, q);
          continue;
        }

        try {
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
          totalQuestions++;
        } catch (questionError) {
          console.error(`❌ Error creating question "${q.title}":`, questionError.message);
        }
      }

      if (questionIds.length > 0) {
        try {
          await Category.create({
            title: cat.title,
            questions: questionIds
          });
          totalCategories++;
          console.log(`✅ Created category "${cat.title}" with ${questionIds.length} questions`);
        } catch (categoryError) {
          console.error(`❌ Error creating category "${cat.title}":`, categoryError.message);
        }
      } else {
        console.warn(`⚠️ Skipping category "${cat.title}" - no valid questions`);
      }
    }

    console.log(`\n🎉 Database Seeded Successfully!`);
    console.log(`📊 Created ${totalCategories} categories`);
    console.log(`🔢 Created ${totalQuestions} questions`);
    
  } catch (err) {
    console.error("❌ Seeder Error:", err.message);
    console.error(err);
  } finally {
    // Always disconnect and exit
    try {
      await mongoose.disconnect();
      console.log('🔌 MongoDB disconnected');
    } catch (disconnectError) {
      console.error('Error disconnecting:', disconnectError.message);
    }
    process.exit(0);
  }
};

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n🛑 Process interrupted');
  try {
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error during cleanup:', error.message);
  }
  process.exit(0);
});

seedData();
