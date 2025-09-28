#!/bin/bash

# Deploy Patient Data Collection System to GitHub Pages
echo "🚀 Deploying Patient Data Collection System to GitHub Pages..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository. Please initialize git first:"
    echo "   git init"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/digitizing-patient-data.git"
    exit 1
fi

# Check if gh-pages is installed
if ! npm list -g gh-pages > /dev/null 2>&1; then
    echo "📦 Installing gh-pages globally..."
    npm install -g gh-pages
fi

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install

# Update homepage URL in package.json
echo "🔧 Configuring GitHub Pages deployment..."
echo "Please update the 'homepage' field in client/package.json with your GitHub username:"
echo "   \"homepage\": \"https://YOUR_USERNAME.github.io/digitizing-patient-data\""
echo ""
read -p "Have you updated the homepage URL? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please update the homepage URL first, then run this script again."
    exit 1
fi

# Build the project
echo "🏗️ Building the React application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix any errors and try again."
    exit 1
fi

# Deploy to GitHub Pages
echo "🚀 Deploying to GitHub Pages..."
npm run deploy

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully deployed to GitHub Pages!"
    echo ""
    echo "📱 Your app is now live at:"
    echo "   https://YOUR_USERNAME.github.io/digitizing-patient-data"
    echo ""
    echo "🔐 Demo Credentials:"
    echo "   Admin: admin@clinic.com / admin123"
    echo "   Researcher: researcher@clinic.com / researcher123"
    echo ""
    echo "💡 Note: It may take a few minutes for GitHub Pages to update."
else
    echo "❌ Deployment failed. Please check the error messages above."
    exit 1
fi

cd ..
