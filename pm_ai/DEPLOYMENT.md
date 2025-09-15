# 🚀 Hybrid Deployment Guide

Deploy your PM Automation Dashboard using the **hybrid approach**:
- **Frontend**: GitHub Pages (Free, Public)
- **Backend**: Railway (Free Tier)
- **Database**: Railway PostgreSQL (Free Tier)

## 📋 Prerequisites

- GitHub account
- Railway account (sign up at https://railway.app)
- Your PM dashboard code

## 🏗️ Part 1: Deploy Backend to Railway

### 1. Sign Up for Railway
1. Go to https://railway.app
2. Sign in with your GitHub account
3. Verify your account

### 2. Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Connect your GitHub account
4. Select your PM dashboard repository
5. Choose the **server** folder as root directory

### 3. Configure Environment Variables
In Railway dashboard, go to **Variables** tab and add:

```
NODE_ENV=production
JWT_SECRET=your-super-secret-change-this-in-production
PORT=3001
```

### 4. Add PostgreSQL Database
1. In Railway project, click **"+ New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway will automatically provide `DATABASE_URL`

### 5. Deploy Backend
1. Railway will auto-deploy from your GitHub repo
2. Note your backend URL: `https://your-app-name.railway.app`
3. Test health check: `https://your-app-name.railway.app/health`

## 🌐 Part 2: Deploy Frontend to GitHub Pages

### 1. Prepare Frontend Build
In your local environment:

```bash
cd client

# Set production API URL
export NEXT_PUBLIC_API_URL=https://your-app-name.railway.app

# Build for production
npm run deploy
```

### 2. Create GitHub Repository
1. Create new repository: `pm-dashboard`
2. Set it to **Public**
3. Enable GitHub Pages in Settings

### 3. Deploy to GitHub Pages

#### Option A: Manual Deploy
```bash
# Copy the 'out' folder contents to your GitHub repository
cp -r out/* /path/to/your/github/repo/
cd /path/to/your/github/repo/
git add .
git commit -m "Deploy PM Dashboard"
git push origin main
```

#### Option B: GitHub Actions (Automated)
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          cd client
          npm install

      - name: Build
        env:
          NEXT_PUBLIC_API_URL: https://your-app-name.railway.app
        run: |
          cd client
          npm run deploy

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./client/out
```

### 4. Configure GitHub Pages
1. Go to repository **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **gh-pages** (if using Actions) or **main**
4. Folder: **/ (root)** or **/docs**

## 🔗 Part 3: Connect Frontend to Backend

### 1. Update CORS in Railway
In Railway, add environment variable:
```
FRONTEND_URL=https://yourusername.github.io/pm-dashboard
```

### 2. Test the Connection
1. Visit: `https://yourusername.github.io/pm-dashboard`
2. Try logging in with: demo@example.com / demo123
3. Test agent execution

## 🎯 Final URLs

- **Frontend**: `https://jvasquezz.github.io/pm-dashboard`
- **Backend**: `https://your-app-name.railway.app`
- **API Health**: `https://your-app-name.railway.app/health`

## 🐛 Troubleshooting

### CORS Errors
- Check FRONTEND_URL in Railway environment variables
- Ensure URLs match exactly (with/without trailing slashes)

### API Connection Failed
- Verify NEXT_PUBLIC_API_URL during build
- Check Railway backend is running: visit `/health` endpoint

### GitHub Pages 404
- Check repository is public
- Verify GitHub Pages is enabled
- Ensure files are in correct directory

### Build Errors
```bash
# Clean and rebuild
cd client
rm -rf .next out node_modules
npm install
npm run deploy
```

## 💡 Pro Tips

1. **Custom Domain**: Add CNAME file for custom domain on GitHub Pages
2. **HTTPS**: Both GitHub Pages and Railway provide HTTPS by default
3. **Monitoring**: Use Railway's built-in monitoring for backend health
4. **Updates**: Push to main branch auto-deploys frontend (with Actions)

## 🔄 Making Updates

### Frontend Updates
```bash
cd client
npm run deploy
# Push 'out' folder contents to GitHub
```

### Backend Updates
```bash
# Just push to GitHub - Railway auto-deploys
git push origin main
```

## 🎉 Share Your Dashboard

Once deployed, share this URL with family and friends:
`https://jvasquezz.github.io/pm-dashboard`

They can:
- ✅ Access without GitHub authentication
- ✅ Create accounts or use demo login
- ✅ Test all PM automation features
- ✅ Provide feedback on your work!

---

**Total Cost**: $0 (Free tiers for everything!)
**Public Access**: ✅ Anyone can access and test
**Full Features**: ✅ All PM agents and database functionality