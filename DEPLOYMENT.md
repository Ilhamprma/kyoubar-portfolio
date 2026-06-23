# Deployment Guide: GitHub & Vercel

This document outlines the step-by-step instructions to deploy your redesigned Next.js portfolio website to **GitHub** and **Vercel**.

---

## 🛠️ Step 1: Initialize Git and Commits (Done)
We have already initialized a local Git repository, configured a local identity, and created the initial commit on the `main` branch:
1. **Initialize Git**: `git init` (Completed)
2. **Rename default branch to main**: `git branch -m main` (Completed)
3. **Commit files**: `git commit -m "feat: Awwwards-style portfolio redesign with GSAP animations"` (Completed)

> [!NOTE]
> You do **not** need to connect the GitHub MCP server to accomplish this deployment. Since Git is already initialized and the files are committed locally, you only need to run the commands in the next step to push it to your GitHub account.

---

## 💻 Step 2: Push to GitHub

1. Open your browser and go to **[GitHub](https://github.com)**.
2. Log in and click the **New** button (or go to `https://github.com/new`) to create a new repository.
3. Configure the new repository:
   - **Repository name**: `portfolio_kyoubar` (or any name you prefer).
   - **Public/Private**: Select according to your preference.
   - **Initialize repository with**: **Do not** check any boxes (No README, No gitignore, No license) because we are pushing an existing local repository.
4. Click **Create repository**.
5. Copy the repository URL (e.g. `https://github.com/your-username/portfolio_kyoubar.git`).
6. Run the following commands in your local terminal (`C:\coding\portfolio_kyoubar`):

```bash
# 1. Link the local repository to your newly created GitHub repository
git remote add origin https://github.com/your-username/portfolio_kyoubar.git

# 2. Push the files to the remote repository
git push -u origin main
```

---

## ⚡ Step 3: Deploy to Vercel

Vercel provides automatic deployments and serverless hosting. It is the recommended platform for Next.js.

1. Go to **[Vercel](https://vercel.com)**.
2. Sign up or log in using your **GitHub account** (this links your Vercel account to GitHub automatically).
3. Click the **Add New...** button on the top right, then select **Project**.
4. You will see a list of your GitHub repositories. Find your repository (`portfolio_kyoubar`) and click **Import**.
5. Configure your project:
   - **Framework Preset**: Vercel will automatically detect **Next.js**.
   - **Root Directory**: `./` (default).
   - **Build and Output Settings**: Default (Next.js handles this automatically).
   - **Environment Variables**: None are required for this project.
6. Click **Deploy**.
7. Vercel will build the website (running `npm run build` and checking TypeScript) and publish it.
8. Within 1–2 minutes, you will receive a preview link (e.g., `https://portfolio-kyoubar.vercel.app`) that is live on the internet!

---

## 🔄 How to Push Future Updates
Once deployed, Vercel will automatically trigger a new build and update your live site whenever you push updates to the `main` branch on GitHub:

```bash
# Stage changes
git add .

# Commit changes
git commit -m "feat: descriptive message of your edit"

# Push to GitHub (Vercel builds and deploys automatically)
git push
```
