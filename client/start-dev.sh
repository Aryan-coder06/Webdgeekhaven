#!/bin/bash

# Frontend Feast Development Starter
echo "🍽️ Welcome to Frontend Feast!"
echo "Starting your development servers..."

# Kill any existing processes
echo "📋 Cleaning up existing processes..."
pkill -f "node.*server.js" || true
pkill -f "vite" || true

# Start backend in background
echo "🔧 Starting backend server on port 5000..."
cd ../server && npm run dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend server on port 5173..."
cd ../client && npm run dev &
FRONTEND_PID=$!

echo ""
echo "🚀 Both servers are starting up!"
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend:  http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user input
wait
