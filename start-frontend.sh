#!/bin/bash

# Frontend-only startup script for mid-fi prototype
echo "🚀 Starting Patient Data Collection Frontend Prototype..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher) first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install frontend dependencies if needed
if [ ! -d "client/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd client && npm install && cd ..
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🎉 Starting the frontend application..."
echo "📱 The app will open at: http://localhost:3000"
echo ""
echo "🔐 Demo Credentials:"
echo "   - Admin: admin@clinic.com / admin123"
echo "   - Researcher: researcher@clinic.com / researcher123"
echo ""
echo "📋 Features to test:"
echo "   - Patient data entry forms"
echo "   - Offline/online status indicators"
echo "   - Export functionality (PDF/CSV)"
echo "   - User management (Admin panel)"
echo "   - Sync status tracking"
echo ""

# Start the frontend
cd client && npm start
