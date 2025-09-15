#!/bin/bash

# PM Automation Dashboard - Development Startup Script
# This demonstrates Claude Code development workflow patterns

echo "🚀 Starting PM Automation Dashboard..."
echo "=====================================/"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: Please run this script from the project root directory"
  exit 1
fi

# Function to check if port is in use
check_port() {
  local port=$1
  if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port $port is already in use"
    return 1
  fi
  return 0
}

# Function to install dependencies if needed
install_deps() {
  local dir=$1
  echo "📦 Checking dependencies in $dir..."

  if [ ! -d "$dir/node_modules" ]; then
    echo "📥 Installing dependencies in $dir..."
    cd "$dir" && npm install
    cd - > /dev/null
  else
    echo "✅ Dependencies already installed in $dir"
  fi
}

# Check ports
check_port 3000 || (echo "Frontend port 3000 in use. Stop the process or use a different port." && exit 1)
check_port 3001 || (echo "Backend port 3001 in use. Stop the process or use a different port." && exit 1)

# Install dependencies
install_deps "client"
install_deps "server"

# Copy environment file if needed
if [ ! -f "server/.env" ]; then
  echo "📝 Creating environment file..."
  cp server/.env.example server/.env
  echo "✅ Environment file created. Update server/.env with your settings."
fi

# Start backend server
echo "🔧 Starting backend server on port 3001..."
cd server && npm run dev &
BACKEND_PID=$!
cd - > /dev/null

# Wait a moment for backend to start
sleep 3

# Start frontend development server
echo "🎨 Starting frontend server on port 3000..."
cd client && npm run dev &
FRONTEND_PID=$!
cd - > /dev/null

# Function to cleanup on exit
cleanup() {
  echo ""
  echo "🛑 Shutting down servers..."
  kill $BACKEND_PID 2>/dev/null
  kill $FRONTEND_PID 2>/dev/null
  echo "✅ Cleanup complete"
  exit 0
}

# Trap Ctrl+C
trap cleanup INT

echo ""
echo "✅ Development servers starting..."
echo "📊 Frontend: http://localhost:3000"
echo "🔗 Backend API: http://localhost:3001"
echo "📚 API Health: http://localhost:3001/health"
echo ""
echo "💡 Demo login: demo@example.com / demo123"
echo ""
echo "Press Ctrl+C to stop all servers"
echo "=================================="

# Wait for user to stop
wait