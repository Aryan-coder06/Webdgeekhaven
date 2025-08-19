import dotenv from 'dotenv';
dotenv.config();

if (!process.env.MONGODB_URL) {
  throw new Error("❌ MONGODB_URL is not defined in .env file");
}

export default {
  port: process.env.PORT || 5000,
  mongodb_url: process.env.MONGODB_URL,
  jwt_secret: process.env.JWT_SECRET || "defaultsecret",
  node_env: process.env.NODE_ENV || "development",
};
