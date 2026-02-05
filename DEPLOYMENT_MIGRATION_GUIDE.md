# 🚀 Deployment Migration Guide

## Overview
This guide provides step-by-step instructions to migrate from the current deployment method (committing build artifacts to main branch) to GitHub Pages artifact deployment.

## Current Issues
- **100+ modified files** in git status from build artifacts
- **Merge conflicts** when assets regenerate with different hashes  
- **Noisy git history** with unnecessary build artifact changes
- **Slower git operations** due to large number of tracked files

## Solution: GitHub Pages Artifact Deployment

### Benefits
✅ **Clean git status** - No more build artifacts showing as modified
✅ **Faster operations** - Smaller repository, faster clones
✅ **No merge conflicts** - Build artifacts not in git history
✅ **Same functionality** - Deployment works exactly the same
✅ **Official method** - Uses GitHub's recommended approach

### Migration Steps

#### 1. Prepare Your Repository

```bash
# Navigate to project directory
cd /Users/giwan/Projects/blog-astro-github

# Add _astro directory to gitignore
echo "docs/_astro/" >> .gitignore
echo "!docs/_astro/.gitkeep" >> .gitignore

# Create keep file to maintain directory structure
mkdir -p docs/_astro
touch docs/_astro/.gitkeep

# Remove cached build artifacts from git
git rm -r --cached docs/_astro/

# Commit the gitignore changes
git add .gitignore docs/_astro/.gitkeep
git commit -m "chore: ignore build artifacts"
```

#### 2. Update GitHub Actions Workflow

Replace your `.github/workflows/deploy.yml` with:

```yaml
name: Deploy

on:
  push:
    branches:
      - main

permissions:
  contents: write
  pages: write      # Required for artifact deployment
  id-token: write   # Required for authentication

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 23
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build

      - name: Build PWA project
        run: npm run build:pwa

      - name: Run tests
        run: npm test

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./docs

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

#### 3. Test and Verify

```bash
# Test local build
npm run build:pwa

# Check git status (should be clean)
git status

# Push changes to trigger deployment
git add .github/workflows/deploy.yml
git commit -m "feat: migrate to artifact-based deployment"
git push origin main
```

#### 4. Monitor Deployment

1. **Go to GitHub Actions** in your repository
2. **Watch the deployment workflow** run
3. **Check the logs** for any errors
4. **Visit your GitHub Pages URL** to verify site is working
5. **Run `git status`** locally - should show no modified files!

### Troubleshooting

#### Issue: Deployment fails with permissions error
**Solution**: Ensure your GitHub Actions workflow has the correct permissions:
```yaml
permissions:
  contents: write
  pages: write
  id-token: write
```

#### Issue: 404 after deployment
**Solution**: 
1. Check GitHub Pages settings in repository settings
2. Ensure it's set to deploy from GitHub Actions
3. Wait 2-5 minutes for DNS propagation

#### Issue: Build artifacts still showing in git
**Solution**: 
```bash
# Force remove from git
git rm -r --cached docs/_astro/
git commit -m "chore: force remove build artifacts"
git push
```

### Rollback Plan

If you need to revert to the old deployment method:

```bash
# Revert gitignore changes
git checkout .gitignore

# Revert workflow changes
git checkout .github/workflows/deploy.yml

# Re-add build artifacts
git add docs/_astro/
git commit -m "revert: back to original deployment method"
git push
```

### Verification Checklist

- [ ] `git status` shows no modified files after build
- [ ] GitHub Actions workflow completes successfully
- [ ] Website is accessible at your GitHub Pages URL
- [ ] All pages load correctly
- [ ] PWA functionality works (if applicable)
- [ ] Search functionality works
- [ ] RSS feed works

### Expected Results

**Before Migration**:
```
$ git status
Changes not staged for commit:
  modified:   docs/_astro/AccessibilityControls.D0xUhIT8.js
  modified:   docs/_astro/BasicPagination.CeVovqMQ.js
  # ... 100+ more files
```

**After Migration**:
```
$ git status
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

### Additional Resources

- [GitHub Pages Artifact Deployment Docs](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-with-a-custom-github-actions-workflow)
- [actions/upload-pages-artifact](https://github.com/actions/upload-pages-artifact)
- [actions/deploy-pages](https://github.com/actions/deploy-pages)

### Support

If you encounter any issues during migration:
1. Check the GitHub Actions logs
2. Review the troubleshooting section
3. Consult the official GitHub documentation
4. The migration is reversible if needed

🎉 **Enjoy your cleaner repository and faster git operations!**