# Raven Labs Website Form Testing Suite

Automated daily testing for all forms on www.theravenlabs.com with comprehensive reporting and email delivery.

## 📋 Overview

This test suite uses **Playwright** to automatically test:

1. **Email Signup Form** - Newsletter subscription form
2. **Request for Services Form** - Contact form with service selection
3. **Get in Touch Footer Form** - Footer contact form
4. **Free Audit Report Form** - Form for requesting an audit report

### Test Coverage

Each form is tested for:
- ✅ Field visibility and existence
- ✅ Required field validation
- ✅ Email format validation
- ✅ Form submission capability
- ✅ Data persistence
- ✅ Error handling
- ✅ Cross-form independence

**Total Tests:** 28 test cases across 6 test suites

## 🚀 Quick Start

### 1. Installation

```bash
# Install dependencies
npm install

# Verify Playwright browsers are installed
npx playwright install
```

### 2. Run Tests Manually

```bash
# Run all tests with verbose output
npm test

# Run tests in UI mode (interactive)
npm run test:ui

# Run tests in debug mode
npm run test:debug

# Run tests with browser visible
npm run test:headed

# Run tests and generate report with email
npm run test:report
```

## 📧 Email Configuration

The test runner can automatically send reports via email. To enable this:

### Setup SMTP Credentials

Set these environment variables:

```bash
export SMTP_HOST="smtp.gmail.com"              # or your SMTP provider
export SMTP_PORT="587"
export SMTP_SECURE="false"                     # true for port 465
export SMTP_USER="your-email@gmail.com"        # Your email address
export SMTP_PASS="your-app-password"           # Gmail: generate App Password
export REPORT_EMAIL="creative@ravenlabs.com.au" # Recipient email
```

### Gmail Setup (Recommended)

1. Enable 2-Factor Authentication on your Google Account
2. Create an **App Password** for Gmail:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Google will generate a 16-character password
   - Use this as `SMTP_PASS`

### Alternative: Other Email Providers

- **Office 365:** host: `smtp.office365.com`, port: `587`
- **SendGrid:** host: `smtp.sendgrid.net`, port: `587`
- **AWS SES:** host: `email-smtp.[region].amazonaws.com`, port: `587`

## 🔄 Daily Automation

### Schedule Daily Tests (9:00 AM IST)

This suite comes configured to run daily at 9:00 AM Asia/Calcutta timezone.

#### Option 1: Using Cron (Linux/Mac)

```bash
# Open crontab editor
crontab -e

# Add this line (9:00 AM IST = 3:30 AM UTC)
30 3 * * * cd /path/to/raven-labs-form-tests && npm run test:report

# Or use a helper script (recommended)
30 3 * * * /path/to/raven-labs-form-tests/run-daily-tests.sh
```

#### Option 2: Using Windows Task Scheduler

1. Open Task Scheduler
2. Create Basic Task → Name it "Raven Labs Form Tests"
3. Set trigger for daily at 9:00 AM
4. Action: Start a program
   - Program: `C:\Program Files\nodejs\node.exe`
   - Arguments: `run-tests-and-report.js`
   - Start in: `C:\path\to\raven-labs-form-tests`

#### Option 3: Using PM2 (Node.js Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Create ecosystem.config.js
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'raven-form-tests',
    script: './run-tests-and-report.js',
    cron_restart: '0 9 * * *',  // 9 AM daily
    env: {
      NODE_ENV: 'production',
      TZ: 'Asia/Calcutta',
      SMTP_USER: process.env.SMTP_USER,
      SMTP_PASS: process.env.SMTP_PASS,
      REPORT_EMAIL: 'creative@ravenlabs.com.au'
    }
  }]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 process list to restart on reboot
pm2 save
pm2 startup
```

#### Option 4: Using Docker

```dockerfile
FROM node:18

WORKDIR /app
COPY . .

RUN npm install
RUN npx playwright install

# Install curl for health checks
RUN apt-get update && apt-get install -y curl

CMD ["npm", "run", "test:report"]
```

Schedule the Docker container with your orchestration tool (Kubernetes, Docker Compose, etc.)

## 📊 Test Reports

### Report Format

Reports are generated in multiple formats:

1. **HTML Report** - Beautiful, interactive report
   - Visual dashboard with test results
   - Detailed breakdown by test suite
   - Pass/fail counts and percentages
   - Timestamps in your local timezone

2. **JSON Report** - Machine-readable format
   - Full test metadata
   - Individual test results
   - Timing information
   - Can be ingested by other systems

3. **JUnit XML** - CI/CD integration format
   - Compatible with Jenkins, GitLab CI, GitHub Actions
   - Standard test result format

### Accessing Reports

```bash
# Open HTML report in browser
npm run report:open

# Reports are saved in ./test-reports/
# Files: test-report-YYYY-MM-DDTHH:MM:SS.*.html
```

### Email Report Contents

When tests run with `npm run test:report`:

1. Email is sent to: `creative@ravenlabs.com.au`
2. Subject: `🧪 Raven Labs Form Tests - Daily Report [XX/28 Passed]`
3. Content includes:
   - Test summary statistics
   - Pass/fail counts
   - Pass percentage
   - Breakdown by test suite
   - Detailed test case results
   - Execution timestamp

## 🔍 Understanding Test Results

### Test Status Indicators

- ✅ **PASSED** - Form field/validation works as expected
- ❌ **FAILED** - Form field/validation does not work or throws error
- ⏭️ **SKIPPED** - Test was skipped (usually due to environment)

### Common Test Suites

**Email Signup Form (5 tests)**
- Basic field visibility
- Email validation (required, format)
- Form submission

**Request for Services Form (5 tests)**
- All fields present (name, company, email, phone, message, service)
- Required field validation
- Email format validation
- Data entry and submission

**Get in Touch Footer Form (3 tests)**
- Footer form visibility
- Field population
- Send button presence

**Free Audit Report Form (3 tests)**
- Bottom-of-page form fields
- Multi-field population
- Submit button presence

**Cross-Form Validation (3 tests)**
- Multiple forms exist on page
- Forms are independent
- All forms are interactive

**Error Handling (4 tests)**
- Special character handling
- Phone format handling
- Rapid submissions
- Form state persistence

## 🛠️ Development

### File Structure

```
raven-labs-form-tests/
├── raven-labs-form-tests.spec.ts    # Main test file
├── run-tests-and-report.js          # Test runner & email script
├── playwright.config.ts              # Playwright configuration
├── package.json                      # Dependencies
├── test-reports/                    # Generated reports (auto-created)
├── playwright-report/               # Playwright HTML reports (auto-created)
└── test-results.json                # JSON test results (auto-created)
```

### Adding New Tests

Edit `raven-labs-form-tests.spec.ts` to add new tests:

```typescript
test('your new test', async ({ page }) => {
  await page.goto(WEBSITE_URL);
  // Your test logic here
  expect(something).toBe(true);
});
```

### Debugging Tests

```bash
# Run single test file
npx playwright test raven-labs-form-tests.spec.ts

# Run specific test
npx playwright test -g "Email Signup Form"

# Debug mode (step through tests)
npx playwright test --debug

# UI mode (interactive, visual debugging)
npx playwright test --ui
```

## 📈 Monitoring & Alerts

### Success Scenarios

- All 28 tests pass ✅
- Report is generated
- Email is sent successfully
- No console errors

### Failure Scenarios

The system will detect:
- Form field not found → Test fails
- Validation not working → Test fails
- Form submission error → Test fails
- Network timeout → Test fails

**When tests fail:**
1. Check the HTML report for details
2. Review the JSON report for specific failures
3. Run `npm run test:headed` to see what's happening visually
4. Check website status (is it down?)

## 🔐 Security Considerations

### Test Data

- Tests use **dummy data** (test@example.com, Test Company)
- **No real user data is submitted**
- All submissions are test/validation only
- Never modify tests to use real user credentials

### SMTP Security

- **Never commit** `.env` file or SMTP passwords to git
- Use environment variables or secure vaults
- Rotate SMTP passwords regularly
- Consider using app-specific passwords (Gmail, Microsoft)

## 🚨 Troubleshooting

### Tests Not Running

```bash
# Clear browser cache
npx playwright install --with-deps

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Email Not Sending

```bash
# Check environment variables
echo $SMTP_USER
echo $SMTP_PASS

# Test SMTP connection
npm run test:report

# Check logs for SMTP errors
```

### Website Not Loading

```bash
# Test website accessibility
curl -I https://www.theravenlabs.com

# If 403/503: Website might be down
# If DNS error: Check internet connection
```

### Playwright Browser Issues

```bash
# Install browsers for your OS
npx playwright install chromium firefox webkit

# Install system dependencies (Linux)
npx playwright install-deps

# Clear Playwright cache
rm -rf ~/.cache/ms-playwright
```

## 📞 Support

For issues or questions:

1. Check test output: `npm run test:headed`
2. Review HTML report in `test-reports/`
3. Check website manually: https://www.theravenlabs.com
4. Review Playwright docs: https://playwright.dev

## 📝 License

MIT - Raven Labs 2024

## 🤝 Contributing

To improve this test suite:

1. Add more test cases for edge cases
2. Improve selectors for better reliability
3. Add API testing alongside form testing
4. Enhance report templates
5. Add performance metrics

---

**Last Updated:** September 2024  
**Test Coverage:** 28 tests × 5 browsers × 4 forms = 560 test scenarios daily  
**Execution Time:** ~2-3 minutes per run  
**Report Email:** creative@ravenlabs.com.au
