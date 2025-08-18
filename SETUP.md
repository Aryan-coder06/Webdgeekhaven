# 🚀 Quick Setup Guide for WebGeekHaven

This guide will help you set up and run the project on your local machine in just a few minutes.

## ⚡ One-Command Setup (Recommended)

```bash
git clone https://github.com/Aryan-coder06/Webdgeekhaven.git
cd Webdgeekhaven
cp server/.env.example server/.env
# Edit server/.env with your MongoDB URL (see step 4 below)
./start-dev.sh
```

## 📋 Step-by-Step Setup

### Step 1: Prerequisites
Make sure you have these installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)
- [MongoDB Atlas account](https://www.mongodb.com/atlas) (free tier works)

### Step 2: Clone the Repository
```bash
git clone https://github.com/Aryan-coder06/Webdgeekhaven.git
cd Webdgeekhaven
```

### Step 3: Install Dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
cd ..
```

### Step 4: Configure Environment
```bash
# Copy environment template
cp server/.env.example server/.env
```

**Edit `server/.env` file:**
```env
MONGODB_URL='mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/webgeekhaven?retryWrites=true&w=majority'
JWT_SECRET='your-secret-key-here'
PORT=5000
```

**To get your MongoDB URL:**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create account/login
3. Create a new cluster (free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password

### Step 5: Seed the Database
```bash
cd server
node seeder.js
```

You should see:
```
🔄 Connecting to MongoDB...
✅ MongoDB Connected Successfully
🧹 Clearing existing data...
✅ Existing data cleared
🌐 Fetching data from external API...
📊 Fetched 14 categories
✅ Created category "Learn the basics" with 31 questions
... (more categories)
🎉 Database Seeded Successfully!
📊 Created 14 categories
🔢 Created 361 questions
```

### Step 6: Start the Application
```bash
# Option 1: Use the startup script (recommended)
./start-dev.sh

# Option 2: Manual startup
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client
npm run dev
```

### Step 7: Access the Application
- **Frontend**: http://localhost:5173 (or port shown in terminal)
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## ✅ Verification

### Test the Backend
```bash
curl http://localhost:5000/health
# Should return: {"status":"OK","message":"Server is running","dbStatus":"connected"}

curl http://localhost:5000/api/questions | head -c 200
# Should return JSON with questions data
```

### Test the Frontend
1. Open http://localhost:5173 in your browser
2. You should see "🍽️ Frontend Feast" title
3. Categories should be visible and expandable
4. Search should work (try searching "array")

## 🐛 Common Issues & Solutions

### Issue: "MongoDB Connection Error"
**Solution:**
- Check your `.env` file has correct MongoDB URL
- Ensure your MongoDB Atlas cluster is running
- Check if your IP is whitelisted in MongoDB Atlas (Network Access)

### Issue: "Port already in use"
**Solution:**
```bash
# Kill existing Node processes
pkill -f node

# Or change port in server/.env
PORT=5001
```

### Issue: "No questions showing"
**Solution:**
```bash
# Re-run the seeder
cd server
node seeder.js
```

### Issue: "Command not found: node"
**Solution:**
- Install Node.js from https://nodejs.org/
- Restart your terminal after installation

### Issue: "Permission denied: ./start-dev.sh"
**Solution:**
```bash
chmod +x start-dev.sh
```

## 🔧 Development Commands

```bash
# Start backend in development mode
cd server && npm run dev

# Start frontend in development mode
cd client && npm run dev

# Build frontend for production
cd client && npm run build

# Seed database
cd server && node seeder.js

# Test API endpoints
curl http://localhost:5000/health
curl http://localhost:5000/api/questions
curl http://localhost:5000/api/categories
```

## 📝 Project Structure
```
Webdgeekhaven/
├── client/           # React frontend
├── server/           # Node.js backend
├── start-dev.sh      # Development startup script
├── SETUP.md         # This file
└── README.md        # Main documentation
```

## 🎯 Next Steps
1. Explore the application features
2. Try the search functionality
3. Browse different categories
4. Check out the code structure
5. Start contributing!

---

**Need help?** Open an issue on GitHub or contact the maintainer.

**Found a bug?** Please report it with steps to reproduce.

**Want to contribute?** Check out the main README.md for contributing guidelines.
