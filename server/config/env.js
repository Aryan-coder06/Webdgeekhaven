import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT || 5000,
  mongodb_url: process.env.MONGODB_URL,
  jwt_secret: process.env.JWT_SECRET,
  node_env: process.env.NODE_ENV
};