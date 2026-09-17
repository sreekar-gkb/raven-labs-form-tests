# 🚀 Raven Labs Form Tests - Setup Guide

## Quick Start (5 minutes)

### Step 1: Install Dependencies

```bash
cd /home/claude
npm install
npx playwright install
```

### Step 2: Configure Email (SMTP)

Create a `.env` file with your email credentials:

```bash
cp .env.example .env
nano .env  # or use your favorite editor
```

Fill in these fields:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
REPORT_EMAIL=creative@ravenlabs.com.au
```

### Step 3: Test Locally

```bash
# Run tests manually first
npm run test:report

# Or run tests with visible browser
npm run test:headed
```

### Step 4: Schedule Daily Tests

✅ **Already Done!** Your daily tests are scheduled to run at **9:00 AM Asia/Calcutta (IST)** every day.

Schedule ID: `trig_01NCraR35mVQCJ9W9arRdiCL`

---

## Email Configuration (Detailed)

### Using Gmail (Recommended)

1. Enable 2-Factor Authentication:
   - Go to https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. Create App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Copy the 16-character password

3. Add to `.env`:
   ```env
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=abcd efgh ijkl mnop  # Without spaces: abcdefghijklmnop
   ```

### Using Other Providers

**Office 365/Outlook:**
```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

**SendGrid:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=SG.your-sendgrid-key
```

**AWS SES:**
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-ses-username
SMTP_PASS=your-ses-password
```

---

## Running Tests

### Manual Test Runs

```bash
# Full test suite with report
npm run test:report

# Run tests with visible browser
npm run test:headed

# Run tests in interactive UI mode
npm run test:ui

# Debug mode (step through tests)
npm run test:debug

# Run specific test suite
npx playwright test -g "Email Signup Form"
```

### View Reports

```bash
# Open last generated HTML report in browser
npm run report:open

# Reports are saved in ./test-reports/
ls test-reports/
```

---

## Automated Daily Testing

### Schedule Created ✅

Your scheduled task is active and configured to:

- **Run Time:** 9:00 AM Asia/Calcutta (IST) Daily
- **UTC Time:** 3:30 AM UTC
- **Test Count:** 28 comprehensive tests
- **Forms Tested:** 4 (Email, Services, Footer, Audit)
- **Report:** Sent to creative@ravenlabs.com.au
- **Duration:** ~2-3 minutes

### Monitor Scheduled Task

```bash
# List all scheduled tasks
list_triggers

# Check status and last run
list_triggers --recurring

# Manual run (for testing)
fire_trigger trig_01NCraR35mVQCJ9W9arRdiCL
```

### If You Need to Modify Schedule

Change run time: Use the schedule settings in Claude desktop app
Disable/Enable: Toggle in scheduled task settings
Delete: Run: `delete_trigger trig_01NCraR35mVQCJ9W9arRdiCL`

---

## Test Coverage

### Forms Tested (4)

1. **Email Signup** ✉️
   - Newsletter subscription form
   - Email validation
   - Form submission

2. **Request for Services** 💼
   - Full name, company, email, phone
   - Service dropdown selection
   - Message textarea
   - Complete validation

3. **Get in Touch Footer** 📧
   - Footer contact form
   - Multiple field inputs
   - Direct message submission

4. **Free Audit Report** 📊
   - Multi-field form
   - Required field validation
   - Full contact information

### Test Types (6 Suites)

✅ Form Structure Tests
- Field visibility
- Field existence
- Required fields

✅ Validation Tests
- Email format validation
- Required field validation
- Phone number format

✅ Submission Tests
- Data entry
- Form submission
- State persistence

✅ Cross-Form Tests
- Multiple forms exist
- Forms are independent
- All forms accessible

✅ Error Handling Tests
- Special characters
- Rapid submissions
- State maintenance

✅ Edge Cases
- Phone validation
- Character handling
- Page interactions

---

## Troubleshooting

### Issue: "SMTP credentials not configured"

**Fix:**
```bash
# Check environment variables
echo $SMTP_USER
echo $SMTP_PASS

# If empty, set them:
export SMTP_USER="your-email@gmail.com"
export SMTP_PASS="your-app-password"

# Or create .env file (preferred)
cat > .env << EOF
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
REPORT_EMAIL=creative@ravenlabs.com.au
EOF
```

### Issue: "Browsers not found"

**Fix:**
```bash
npx playwright install
npx playwright install-deps  # For Linux
```

### Issue: "Tests timing out"

**Fix:**
```bash
# Check website is accessible
curl -I https://www.theravenlabs.com

# Run with extended timeout
TIMEOUT=60000 npm test

# Run in debug mode to see what's happening
npm run test:debug
```

### Issue: "Email not sending"

**Fix:**
```bash
# Verify SMTP settings
echo "SMTP_HOST: $SMTP_HOST"
echo "SMTP_PORT: $SMTP_PORT"
echo "SMTP_USER: $SMTP_USER"

# Test with telnet (Linux/Mac)
telnet smtp.gmail.com 587

# For Gmail, check:
# 1. 2-Factor Auth is enabled
# 2. App Password was generated (16 chars)
# 3. Password has no spaces
```

### Issue: "Report file not found"

**Fix:**
```bash
# Create reports directory
mkdir -p test-reports

# Check write permissions
ls -la test-reports/

# Run tests again
npm run test:report
```

---

## Project Structure

```
/home/claude/
├── raven-labs-form-tests.spec.ts    # 28 test cases
├── run-tests-and-report.js          # Test runner + email
├── playwright.config.ts              # Playwright config
├── package.json                      # Dependencies
├── .env                             # SMTP config (git-ignored)
├── .env.example                     # Config template
├── README.md                        # Full documentation
├── SETUP_GUIDE.md                   # This file
├── run-daily-tests.sh               # Shell script runner
├── test-reports/                    # Generated reports
├── playwright-report/               # Playwright HTML reports
└── test-results.json                # JSON test results
```

---

## File Permissions

Make scripts executable:

```bash
chmod +x run-daily-tests.sh
```

---

## First Test Run Checklist

- [ ] Node.js installed (`node -v` should show v14+)
- [ ] npm installed (`npm -v` should show v6+)
- [ ] Dependencies installed (`npm install` completed)
- [ ] Playwright browsers installed (`npx playwright install` completed)
- [ ] `.env` file created with SMTP credentials
- [ ] Website is accessible (`curl -I https://www.theravenlabs.com`)
- [ ] Email provider configured (Gmail app password generated)
- [ ] Test files present (`ls raven-labs-form-tests.spec.ts`)
- [ ] Manual test run successful (`npm run test:report`)
- [ ] HTML report generated in `test-reports/`
- [ ] Email received at creative@ravenlabs.com.au

---

## Performance Notes

- **Test Execution:** ~2-3 minutes per run
- **Browsers Tested:** Chromium, Firefox, WebKit (3 parallel)
- **Mobile Tested:** Chrome Mobile, Safari Mobile
- **Total Test Scenarios:** 28 tests × 5 browsers = 140 scenarios daily
- **Report Generation:** HTML + JSON + XML formats
- **Email Size:** ~500KB-1MB (includes HTML report)

---

## Support & Debugging

### View Live Test Execution

```bash
npm run test:headed    # See browser in action
npm run test:ui        # Interactive UI mode
npm run test:debug     # Step through tests
```

### View Test Reports

```bash
npm run report:open    # Open HTML report
cat test-results.json  # View JSON results
ls -lah test-reports/  # List all reports
```

### Check Logs

```bash
# Last 50 lines of activity
tail -n 50 test-runs.log

# All activity for today
grep "$(date +%Y-%m-%d)" test-runs.log
```

### Get Help

1. Check README.md for detailed documentation
2. Review test output: `npm run test:headed`
3. Check website manually: https://www.theravenlabs.com
4. Verify SMTP settings are correct
5. Check Playwright documentation: https://playwright.dev

---

## Next Steps

1. ✅ Run `npm install` to install dependencies
2. ✅ Create `.env` file with SMTP credentials
3. ✅ Run `npm run test:report` for first manual test
4. ✅ Verify email is received
5. ✅ Check scheduled task runs tomorrow at 9 AM IST

---

**Setup Status:** 🟢 Ready for Automated Daily Testing

Daily reports will be sent to: **creative@ravenlabs.com.au**  
Schedule: **9:00 AM Asia/Calcutta (IST) Daily**  
Next run: Tomorrow at 9:00 AM IST

---

**Questions?** Check README.md for comprehensive documentation.
