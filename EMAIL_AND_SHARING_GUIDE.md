# 📧 Email Configuration & Project Sharing Guide

## Part 1: Change Report Email Address

### Option A: Change in .env File (Easiest)

1. **Edit the .env file:**
   ```bash
   nano .env
   # or
   vi .env
   # or open with your text editor
   ```

2. **Change this line:**
   ```diff
   - REPORT_EMAIL=creative@ravenlabs.com.au
   + REPORT_EMAIL=newemail@ravenlabs.com.au
   ```

3. **Save the file** (Ctrl+O, then Enter, then Ctrl+X if using nano)

4. **Test immediately:**
   ```bash
   npm run test:report
   ```

5. **Next scheduled run** will use the new email

### Option B: Change in Environment Variable

```bash
# Set for current session
export REPORT_EMAIL="newemail@ravenlabs.com.au"

# Run tests
npm run test:report

# Or set permanently in ~/.bashrc or ~/.zshrc
echo 'export REPORT_EMAIL="newemail@ravenlabs.com.au"' >> ~/.bashrc
source ~/.bashrc
```

### Option C: Change Multiple Recipients

To send reports to multiple emails:

**Edit `run-tests-and-report.js`:**

Find this section around line 30:
```javascript
const CONFIG = {
  websiteUrl: 'https://www.theravenlabs.com',
  email: process.env.REPORT_EMAIL || 'creative@ravenlabs.com.au',
```

Change to:
```javascript
const CONFIG = {
  websiteUrl: 'https://www.theravenlabs.com',
  email: process.env.REPORT_EMAIL || 'creative@ravenlabs.com.au',
  additionalEmails: [
    'manager@ravenlabs.com.au',
    'stakeholder@ravenlabs.com.au'
  ],
```

Then update the email sending section around line 180:
```javascript
const mailOptions = {
  from: CONFIG.smtpConfig.auth.user,
  to: [CONFIG.email, ...CONFIG.additionalEmails].join(', '),
```

### Option D: Change Via Scheduled Task

If you want to change just the scheduled task (not the manual runs):

1. Go to Claude desktop app → Scheduled tasks
2. Find "Raven Labs Daily Form Tests - 9 AM IST"
3. Edit the prompt and change the email reference
4. Save changes

---

## Part 2: Share This Project With Others

### Method 1: Share as GitHub Repository (Recommended)

#### Step 1: Create GitHub Repo

```bash
cd /home/claude

# Initialize git repository
git init

# Create .gitignore to exclude sensitive files
cat > .gitignore << 'EOF'
node_modules/
.env
.env.local
test-reports/
playwright-report/
test-results.json
*.log
.DS_Store
EOF

# Add files to git
git add .

# Make initial commit
git commit -m "Initial commit: Raven Labs form testing suite"
```

#### Step 2: Push to GitHub

```bash
# Create new repository on GitHub.com
# Then run:

git remote add origin https://github.com/yourusername/raven-labs-form-tests.git
git branch -M main
git push -u origin main
```

#### Step 3: Share GitHub Link

Share this link with your team:
```
https://github.com/yourusername/raven-labs-form-tests
```

Team members can then:
```bash
git clone https://github.com/yourusername/raven-labs-form-tests.git
cd raven-labs-form-tests
npm install
cp .env.example .env
# Edit .env with their credentials
npm run test:report
```

---

### Method 2: Share as ZIP File

```bash
# Create compressed archive
cd /home/claude
zip -r raven-labs-form-tests.zip . \
  -x "node_modules/*" \
  ".env" \
  "test-reports/*" \
  "playwright-report/*" \
  ".git/*" \
  "*.log"

# Share the ZIP file
# Recipients extract and run:
unzip raven-labs-form-tests.zip
cd raven-labs-form-tests
npm install
cp .env.example .env
# Edit .env
npm run test:report
```

---

### Method 3: Share as Docker Container

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
RUN apk add --no-cache bash curl

# Copy project files
COPY . .

# Install npm packages
RUN npm install

# Install Playwright browsers
RUN npx playwright install

# Create reports directory
RUN mkdir -p test-reports

# Run tests when container starts
CMD ["npm", "run", "test:report"]
```

Create a `docker-compose.yml`:

```yaml
version: '3.8'

services:
  form-tests:
    build: .
    environment:
      SMTP_HOST: ${SMTP_HOST:-smtp.gmail.com}
      SMTP_PORT: ${SMTP_PORT:-587}
      SMTP_SECURE: ${SMTP_SECURE:-false}
      SMTP_USER: ${SMTP_USER}
      SMTP_PASS: ${SMTP_PASS}
      REPORT_EMAIL: ${REPORT_EMAIL:-creative@ravenlabs.com.au}
    volumes:
      - ./test-reports:/app/test-reports
    networks:
      - testing

networks:
  testing:
    driver: bridge
```

Share instructions:

```bash
# Team members run:
docker-compose up

# Or with specific credentials:
SMTP_USER="email@gmail.com" \
SMTP_PASS="app-password" \
REPORT_EMAIL="recipient@example.com" \
docker-compose up
```

---

### Method 4: Create Organization Shared Drive

#### For Google Drive:

1. Create folder: `Raven Labs Form Tests`
2. Upload all files:
   ```bash
   gsutil -m cp -r /home/claude/* gs://your-bucket/raven-labs-form-tests/
   ```
3. Share folder with team members
4. They can download and use locally

#### For OneDrive/SharePoint:

1. Upload project files to shared folder
2. Add setup instructions in a README
3. Share link with team

---

### Method 5: Create NPM Package

```bash
# Create package.json entry
cat >> package.json << 'EOF'
{
  "name": "@ravenlabs/form-tests",
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
}
EOF

# Publish to GitHub Packages
npm publish

# Team members install:
npm install @ravenlabs/form-tests
```

---

## Sharing Best Practices

### What To Include

✅ Include:
- All `.spec.ts` test files
- Configuration files (`playwright.config.ts`)
- Package files (`package.json`)
- Documentation (`README.md`, `SETUP_GUIDE.md`)
- Environment template (`.env.example`)
- Helper scripts (`run-daily-tests.sh`)
- License file

❌ Don't Include:
- `.env` file (has real credentials)
- `node_modules/` folder (large, regenerated by npm)
- `test-reports/` folder (old reports)
- `.git/` folder (unless sharing full repo)
- Personal credentials or secrets
- `playwright-report/` folder (generated)

### Security When Sharing

1. **Never share .env file** - Always use .env.example template
2. **Use GitHub secrets** for scheduled tasks in CI/CD
3. **Rotate SMTP credentials** if leaked
4. **Review who has access** to test results
5. **Use environment variables** instead of hardcoding
6. **Mark repository as private** if containing sensitive info

---

## Sharing Preset Configurations

### Share Common SMTP Settings

Create `smtp-presets.json`:

```json
{
  "gmail": {
    "SMTP_HOST": "smtp.gmail.com",
    "SMTP_PORT": "587",
    "SMTP_SECURE": "false"
  },
  "office365": {
    "SMTP_HOST": "smtp.office365.com",
    "SMTP_PORT": "587",
    "SMTP_SECURE": "false"
  },
  "sendgrid": {
    "SMTP_HOST": "smtp.sendgrid.net",
    "SMTP_PORT": "587",
    "SMTP_SECURE": "false"
  }
}
```

Team members can use:
```bash
# Setup for Gmail
cat smtp-presets.json | jq '.gmail'
# Copy those settings to .env
```

---

## Team Collaboration Setup

### GitHub Team Collaboration

1. **Create GitHub Organization**
   ```bash
   # On GitHub.com, create org: ravenlabs
   ```

2. **Add team members**
   ```bash
   # On GitHub.com → Organization → Teams → Add members
   ```

3. **Set branch protection rules**
   - Require pull requests for changes
   - Require status checks (run tests)
   - Restrict who can approve

4. **Enable discussions**
   - GitHub Discussions → Share updates
   - Q&A section for troubleshooting

5. **Setup GitHub Actions** for automatic runs:

Create `.github/workflows/daily-tests.yml`:

```yaml
name: Daily Form Tests

on:
  schedule:
    - cron: '30 3 * * *'  # 9 AM IST daily
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npx playwright install
      - run: npm run test:report
        env:
          SMTP_HOST: ${{ secrets.SMTP_HOST }}
          SMTP_PORT: ${{ secrets.SMTP_PORT }}
          SMTP_USER: ${{ secrets.SMTP_USER }}
          SMTP_PASS: ${{ secrets.SMTP_PASS }}
          REPORT_EMAIL: ${{ secrets.REPORT_EMAIL }}
```

Then add secrets in GitHub:
- Settings → Secrets → Add:
  - `SMTP_HOST`
  - `SMTP_USER`
  - `SMTP_PASS`
  - `REPORT_EMAIL`

---

## Sharing Change Email & Credentials Safely

### For Internal Team:

1. **Create .env.internal file (git-ignored)**
   ```bash
   # Only team leads have access
   SMTP_USER=team-email@ravenlabs.com.au
   SMTP_PASS=secure-app-password
   REPORT_EMAIL=team-reports@ravenlabs.com.au
   ```

2. **Share via secure channel**
   - Password manager (1Password, LastPass)
   - Encrypted email
   - Team chat (encrypted)
   - Never: Slack, GitHub, or plain text

3. **Rotate credentials quarterly**
   - Generate new app passwords
   - Update all team .env files
   - Document in changelog

### For External Share:

1. **Create fresh credentials** for external user
2. **Use limited permissions** (read-only, specific sender)
3. **Set credential expiration** if possible
4. **Monitor usage** in email logs
5. **Revoke access** when no longer needed

---

## Example: Complete Sharing Workflow

### Scenario: Share with DevOps Team

```bash
# 1. Export clean project
cd /home/claude
zip -r raven-labs-form-tests.zip . \
  -x "node_modules/*" ".env" "test-reports/*" ".git/*" "*.log"

# 2. Create internal README
cat > DEVOPS_README.md << 'EOF'
# Setup for DevOps Team

## Quick Start
1. Extract ZIP file
2. Create .env from .env.example
3. Contact cloud-ops for SMTP credentials
4. Run: npm install && npm run test:report

## Credentials
- Get SMTP_USER and SMTP_PASS from: https://internal-vault.company.com
- Set REPORT_EMAIL to your team email
- Never commit .env file

## Questions?
- Slack: #devops-qa
- Email: devops@ravenlabs.com.au
EOF

# 3. Share via secure method
# - Upload to internal server
# - Email link to team
# - Post to internal wiki
# - Add to onboarding checklist

# 4. Include in documentation
echo "See DEVOPS_README.md for setup"
```

---

## Verify Setup After Sharing

Team members should test:

```bash
# 1. Verify extraction
ls raven-labs-form-tests.spec.ts  # Should exist

# 2. Install dependencies
npm install

# 3. Configure SMTP
nano .env

# 4. Run manual test
npm run test:report

# 5. Verify email received
# Check inbox for report from npm run test:report

# 6. Verify schedule is set
# Check scheduled tasks for daily automation
```

---

## Support for Shared Projects

### Create Issue Template

Create `.github/ISSUE_TEMPLATE/bug_report.md`:

```markdown
## Bug Description
Describe the issue...

## Steps to Reproduce
1. ...
2. ...

## Expected Behavior
...

## Actual Behavior
...

## Environment
- OS: (Windows/Mac/Linux)
- Node version: (output of `node -v`)
- NPM version: (output of `npm -v`)
- Test results: (attach HTML report)

## Logs
(Paste relevant error messages)
```

### Create Discussion Forum

Enable GitHub Discussions:
- Setup Guide Q&A
- Test Results sharing
- SMTP Configuration help
- General Discussion

---

## Revoke Access

When someone leaves the project:

1. **Revoke GitHub access**
   ```bash
   # GitHub → Organization → Members → Remove
   ```

2. **Rotate SMTP credentials**
   ```bash
   # Generate new Gmail app password
   # Update .env in central location
   # Notify team to pull latest
   ```

3. **Review logs**
   ```bash
   # Check email logs for unauthorized sends
   # Verify test reports still work
   ```

---

## Quick Reference: Change Email Commands

```bash
# Quick change for current user
export REPORT_EMAIL="newemail@ravenlabs.com.au"
npm run test:report

# Permanent change in .env
echo "REPORT_EMAIL=newemail@ravenlabs.com.au" >> .env

# Add to multiple recipients
nano run-tests-and-report.js  # Edit mailOptions.to

# Share via GitHub
git init && git remote add origin https://github.com/user/repo.git
git add . && git commit -m "Initial commit" && git push

# Share via ZIP
zip -r project.zip . -x "node_modules/*" ".env" "test-reports/*"

# Share via Docker
docker build -t raven-labs-tests .
docker push your-registry/raven-labs-tests
```

---

## Summary

**To Change Email:**
```bash
# Edit .env file
REPORT_EMAIL=new-email@ravenlabs.com.au
# or use environment variable
export REPORT_EMAIL="new-email@ravenlabs.com.au"
```

**To Share Project:**
1. **GitHub** (best for teams) - Secure, collaborative, automatic
2. **ZIP file** (simple) - Easy distribution, manual setup
3. **Docker** (scalable) - Container-based deployment
4. **Drive** (enterprise) - Company infrastructure

**Security Tips:**
- ✅ Always use .env.example template
- ✅ Never commit real credentials
- ✅ Rotate SMTP passwords quarterly
- ✅ Use GitHub Secrets for CI/CD
- ✅ Mark repos as private if sensitive

---

**Questions?** See README.md or reach out to your team administrator.
