#!/bin/bash

# WebGeekHaven Development Startup Script
echo "🚀 Starting WebGeekHaven Development Environment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js v18+ first.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

# Check if .env file exists in server directory
if [ ! -f "server/.env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found in server directory.${NC}"
    echo "Please create server/.env file with your MongoDB connection string."
    echo "You can copy from server/.env.example and modify it."
    echo ""
    echo "Example:"
    echo "cp server/.env.example server/.env"
    echo ""
    exit 1
fi

# Function to check if port is available
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Port $port is already in use. Please close the application using it or change the port.${NC}"
        return 1
    fi
    return 0
}

# Check if required ports are available
echo "🔍 Checking ports..."
check_port 5000 || exit 1
check_port 5173 || echo -e "${YELLOW}⚠️  Port 5173 is in use, Vite will try another port.${NC}"

# Install dependencies if node_modules don't exist
echo ""
echo -e "${BLUE}📦 Checking dependencies...${NC}"

if [ ! -d "server/node_modules" ]; then
    echo -e "${YELLOW}Installing server dependencies...${NC}"
    cd server && npm install && cd ..
fi

if [ ! -d "client/node_modules" ]; then
    echo -e "${YELLOW}Installing client dependencies...${NC}"
    cd client && npm install && cd ..
fi

echo -e "${GREEN}✅ Dependencies are ready!${NC}"
echo ""

# Check if database is seeded
echo -e "${BLUE}🗄️  Database Setup${NC}"
echo "Make sure your MongoDB is running and accessible."
echo "If this is your first time, run: cd server && node seeder.js"
echo ""

# Start the servers
echo -e "${GREEN}🎬 Starting development servers...${NC}"
echo ""
echo -e "${BLUE}Backend will run on: http://localhost:5000${NC}"
echo -e "${BLUE}Frontend will run on: http://localhost:5173 (or next available port)${NC}"
echo ""

# Function to cleanup background processes
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Shutting down servers...${NC}"
    kill $backend_pid $frontend_pid 2>/dev/null
    wait $backend_pid $frontend_pid 2>/dev/null
    echo -e "${GREEN}✅ Servers stopped successfully!${NC}"
}

# Set up trap for cleanup on script exit
trap cleanup EXIT

# Start backend server in background
echo -e "${BLUE}Starting backend server...${NC}"
cd server
npm start &
backend_pid=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend server in background
echo -e "${BLUE}Starting frontend server...${NC}"
cd client
npm run dev &
frontend_pid=$!
cd ..

echo ""
echo -e "${GREEN}🎉 Both servers are starting up!${NC}"
echo ""
echo -e "${YELLOW}📝 Quick Commands:${NC}"
echo "  - Press Ctrl+C to stop both servers"
echo "  - Backend API: http://localhost:5000/health"
echo "  - Frontend: Check terminal output above for exact URL"
echo ""
echo -e "${YELLOW}🔧 Troubleshooting:${NC}"
echo "  - If frontend port conflicts, Vite will use next available port"
echo "  - Check server/.env for correct MongoDB connection string"
echo "  - Run 'node server/seeder.js' if no questions appear"
echo ""

# Wait for both processes
wait $backend_pid $frontend_pid
