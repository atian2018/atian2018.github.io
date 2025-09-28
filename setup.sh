#!/bin/bash

# Setup script for Digitizing Patient Data prototype
echo "🚀 Setting up Digitizing Patient Data Prototype..."

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

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd client && npm install && cd ..

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p logs
mkdir -p uploads

# Set up environment variables
echo "🔧 Setting up environment variables..."
if [ ! -f .env ]; then
    cat > .env << EOF
# Environment Configuration
NODE_ENV=development
PORT=5000
JWT_SECRET=your-secret-key-change-in-production-$(date +%s)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Database Configuration
DB_PATH=./patient_data.db

# Security
CORS_ORIGIN=http://localhost:3000
EOF
    echo "✅ Created .env file with default values"
else
    echo "✅ .env file already exists"
fi

# Build the frontend
echo "🏗️ Building frontend..."
cd client && npm run build && cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Start the development server: npm run dev"
echo "2. Open your browser to: http://localhost:3000"
echo "3. Login with demo credentials:"
echo "   - Admin: admin@clinic.com / admin123"
echo "   - Researcher: researcher@clinic.com / researcher123"
echo ""
echo "🔧 For production deployment:"
echo "1. Update .env file with production values"
echo "2. Set JWT_SECRET to a secure random string"
echo "3. Configure email settings for password reset"
echo "4. Set up HTTPS and proper security headers"
echo ""
echo "📚 See README.md for detailed documentation"
echo ""
echo "Happy coding! 🚀"
