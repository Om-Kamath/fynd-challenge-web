# Deployment Guide - Vercel

## Prerequisites

1. A [Vercel account](https://vercel.com/signup) (free)
2. A [MongoDB Atlas account](https://www.mongodb.com/atlas) (free tier available)
3. An [OpenAI API key](https://platform.openai.com/api-keys)
4. [Git](https://git-scm.com/) installed
5. Your code pushed to GitHub, GitLab, or Bitbucket

---

## Step 1: Set Up MongoDB Atlas

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and sign up/log in
2. Click **"Build a Database"** → Select **M0 FREE** tier
3. Choose a cloud provider and region (any works)
4. Click **"Create Cluster"** (takes 1-3 minutes)
5. **Create a database user:**
   - Go to **Security** → **Database Access**
   - Click **"Add New Database User"**
   - Choose **Password** authentication
   - Enter a username and password (save these!)
   - Click **"Add User"**
6. **Allow network access:**
   - Go to **Security** → **Network Access**
   - Click **"Add IP Address"**
   - Click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
   - Click **"Confirm"**
7. **Get your connection string:**
   - Go to **Deployment** → **Database**
   - Click **"Connect"** → **"Drivers"**
   - Copy the connection string (looks like):
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<username>` and `<password>` with your credentials

---

## Step 2: Get OpenAI API Key

1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Click **"Create new secret key"**
3. Give it a name (e.g., "Feedback App")
4. Copy the key (starts with `sk-`) - you can only see it once!

---

## Step 3: Push Code to GitHub

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - AI Feedback System"

# Add your GitHub repo as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git push -u origin main
```

---

## Step 4: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and log in
2. Click **"Add New..."** → **"Project"**
3. **Import your Git repository:**
   - Connect your GitHub/GitLab/Bitbucket account
   - Select your repository
4. **Configure project:**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
5. **Add Environment Variables:**
   - Click **"Environment Variables"**
   - Add these two variables:
   
   | Name | Value |
   |------|-------|
   | `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/...` |
   | `OPENAI_API_KEY` | `sk-proj-...` |
   
6. Click **"Deploy"**
7. Wait 1-2 minutes for deployment to complete

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# For production deployment
vercel --prod
```

When prompted for environment variables, enter your `MONGODB_URI` and `OPENAI_API_KEY`.

---

## Step 5: Verify Deployment

After deployment completes:

1. **User Dashboard URL:** `https://your-project.vercel.app/`
2. **Admin Dashboard URL:** `https://your-project.vercel.app/admin`
3. **Health Check:** `https://your-project.vercel.app/api/health`

### Test the deployment:
1. Open the User Dashboard
2. Submit a test review with a star rating
3. Verify you receive an AI-generated response
4. Open the Admin Dashboard
5. Verify your review appears with AI summary and recommendations

---

## Troubleshooting

### "Database connection failed"
- Verify your `MONGODB_URI` is correct
- Check that your IP is whitelisted (use `0.0.0.0/0` for Vercel)
- Ensure special characters in password are URL-encoded (`@` → `%40`)

### "LLM error" or no AI response
- Verify your `OPENAI_API_KEY` is correct
- Check you have API credits in your OpenAI account
- The app will use fallback responses if OpenAI is unavailable

### Build fails
```bash
# Test build locally first
npm run build
```

### Environment variables not working
- Go to Vercel Dashboard → Project → Settings → Environment Variables
- Make sure variables are set for **Production** environment
- Redeploy after adding/changing variables

---

## Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

---

## URLs After Deployment

| Dashboard | URL |
|-----------|-----|
| User Dashboard | `https://your-app.vercel.app/` |
| Admin Dashboard | `https://your-app.vercel.app/admin` |
| Health Check | `https://your-app.vercel.app/api/health` |
| Reviews API | `https://your-app.vercel.app/api/reviews` |
