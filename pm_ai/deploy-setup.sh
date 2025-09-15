#!/bin/bash

echo "🚀 PM Dashboard Deployment Setup"
echo "================================="

# Step 1: Check git status
echo "📋 Step 1: Checking git status..."
git status

# Step 2: Add all files to git
echo "📋 Step 2: Adding files to git..."
git add .

# Step 3: Commit changes
echo "📋 Step 3: Committing changes..."
git commit -m "Prepare for hybrid deployment

🔧 Backend configured for Railway:
- Added railway.toml configuration
- Updated CORS for GitHub Pages
- Added PostgreSQL support
- Environment variables template

🌐 Frontend configured for GitHub Pages:
- Static export setup
- Dynamic API URL configuration
- GitHub Pages optimization

🚀 Ready for deployment!"

# Step 4: Push to GitHub
echo "📋 Step 4: Pushing to GitHub..."
git push origin main

echo "✅ Code pushed to GitHub!"
echo ""
echo "🎯 Next steps:"
echo "1. Go to https://railway.app"
echo "2. Sign in with GitHub"
echo "3. Create new project from your repo"
echo "4. Select the 'server' folder"
echo ""
echo "📱 Run this script with: chmod +x deploy-setup.sh && ./deploy-setup.sh"