# Push to GitHub

Follow these steps to push this project to your GitHub repository:

```bash
# 1. Extract this zip file
unzip raven-labs-form-tests.zip
cd raven-labs-form-tests

# 2. Initialize git
git init
git config user.email "your-email@example.com"
git config user.name "Your Name"

# 3. Add files
git add -A

# 4. Create initial commit
git commit -m "Initial commit: Raven Labs form testing suite"

# 5. Add your GitHub repository
git remote add origin https://github.com/sreekar-gkb/raven-labs-form-tests.git

# 6. Push to GitHub
git branch -M main
git push -u origin main
```

When prompted for credentials:
- Username: Your GitHub username
- Password: Your GitHub personal access token (or password)

If you haven't created a personal access token yet:
1. Go to GitHub Settings → Developer Settings → Personal Access Tokens
2. Create a token with `repo` scope
3. Use the token as your password when pushing

Done! Your repository is now on GitHub.
