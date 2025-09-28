# 🚀 GitHub Pages Deployment Guide

This guide will help you deploy your Patient Data Collection System prototype to GitHub Pages for free hosting.

## 📋 Prerequisites

1. **GitHub Account**: You need a GitHub account
2. **Git Repository**: Your project should be in a Git repository
3. **Node.js**: Make sure Node.js is installed on your system

## 🔧 Step-by-Step Deployment

### 1. Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click "New repository" or the "+" icon
3. Name your repository: `digitizing-patient-data`
4. Make it **Public** (required for free GitHub Pages)
5. Don't initialize with README (we already have files)
6. Click "Create repository"

### 2. Initialize Git (if not already done)

```bash
# If this is a new project
git init
git add .
git commit -m "Initial commit: Patient Data Collection System"

# Add your GitHub repository as origin
git remote add origin https://github.com/YOUR_USERNAME/digitizing-patient-data.git
git branch -M main
git push -u origin main
```

### 3. Configure GitHub Pages

1. **Update Homepage URL**: Edit `client/package.json` and replace `YOUR_USERNAME` with your actual GitHub username:

```json
{
  "homepage": "https://YOUR_USERNAME.github.io/digitizing-patient-data"
}
```

2. **Install Dependencies**: 
```bash
cd client
npm install
```

### 4. Deploy to GitHub Pages

**Option A: Using the Deployment Script**
```bash
# From the project root directory
./deploy-to-github-pages.sh
```

**Option B: Manual Deployment**
```bash
# Install gh-pages globally
npm install -g gh-pages

# Navigate to client directory
cd client

# Build the project
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### 5. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **Deploy from a branch**
5. Select **gh-pages** branch and **/ (root)** folder
6. Click **Save**

## 🌐 Access Your Live Application

Your application will be available at:
```
https://YOUR_USERNAME.github.io/digitizing-patient-data
```

**Note**: It may take 5-10 minutes for GitHub Pages to build and deploy your site.

## 🔐 Demo Credentials

Once deployed, users can test the application with:

- **Administrator**: `admin@clinic.com` / `admin123`
- **Researcher**: `researcher@clinic.com` / `researcher123`

## 🔄 Updating Your Deployment

To update your deployed application:

1. Make your changes
2. Commit and push to main branch:
   ```bash
   git add .
   git commit -m "Update: description of changes"
   git push origin main
   ```
3. Redeploy:
   ```bash
   cd client
   npm run deploy
   ```

## 🛠️ Troubleshooting

### Build Errors
- Check that all dependencies are installed: `npm install`
- Ensure no syntax errors in your code
- Check browser console for runtime errors

### GitHub Pages Not Updating
- Wait 5-10 minutes for GitHub Pages to rebuild
- Check the **Actions** tab in your GitHub repository for build logs
- Verify the `gh-pages` branch exists and has the latest build

### 404 Errors
- Ensure the `homepage` field in `package.json` matches your repository URL
- Check that GitHub Pages is enabled in repository settings
- Verify the `gh-pages` branch contains the `build` folder

### Routing Issues
- GitHub Pages serves static files, so client-side routing needs special configuration
- The current setup uses `HashRouter` which works with GitHub Pages
- For `BrowserRouter`, you'd need a `404.html` file that redirects to `index.html`

## 📱 Features Available in Live Demo

✅ **Complete Patient Data Entry**
- Offline-capable forms with local storage
- Real-time validation and error handling
- Auto-generated patient IDs

✅ **Export Functionality**
- PDF export (downloads as .txt in demo)
- CSV export with filtering
- Date range filtering

✅ **User Management**
- Role-based access control
- Admin panel with user management
- Comprehensive audit logging

✅ **Connection Status**
- Multi-level online/offline indicators
- Prominent status banners
- Interactive connection testing

✅ **All 10 Usability Heuristics**
- Visibility of system status
- Match between system and real world
- User control and freedom
- Consistency and standards
- Error prevention
- Recognition rather than recall
- Flexibility and efficiency
- Aesthetic and minimalist design
- Error recognition & recovery
- Help and documentation

## 🎯 Perfect for Demonstrations

This GitHub Pages deployment is ideal for:
- **Client presentations**
- **User testing sessions**
- **Stakeholder demos**
- **Portfolio showcases**
- **Academic submissions**

The live demo showcases all the functionality without requiring any backend setup or database configuration.
