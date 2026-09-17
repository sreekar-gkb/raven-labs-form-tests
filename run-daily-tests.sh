#!/bin/bash

# Raven Labs Form Tests - Daily Test Runner
# Runs tests daily and generates reports with email

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$SCRIPT_DIR"

# Load environment variables if .env file exists
if [ -f "$PROJECT_DIR/.env" ]; then
    export $(cat "$PROJECT_DIR/.env" | grep -v '^#' | xargs)
    echo "✅ Loaded environment variables from .env"
fi

# Log file
LOG_FILE="$PROJECT_DIR/test-runs.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

echo "========================================" >> "$LOG_FILE"
echo "Test Run: $TIMESTAMP" >> "$LOG_FILE"
echo "========================================" >> "$LOG_FILE"

echo -e "${YELLOW}🧪 Starting Raven Labs Form Tests${NC}"
echo "📂 Project directory: $PROJECT_DIR"
echo "📝 Log file: $LOG_FILE"
echo ""

# Change to project directory
cd "$PROJECT_DIR"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install 2>&1 | tee -a "$LOG_FILE"
fi

# Run tests with report
echo -e "${YELLOW}🚀 Running tests...${NC}"
if npm run test:report >> "$LOG_FILE" 2>&1; then
    echo -e "${GREEN}✅ Tests completed successfully!${NC}"
    echo "✅ Tests completed successfully!" >> "$LOG_FILE"
else
    TEST_EXIT_CODE=$?
    echo -e "${RED}❌ Tests failed with exit code: $TEST_EXIT_CODE${NC}"
    echo "❌ Tests failed with exit code: $TEST_EXIT_CODE" >> "$LOG_FILE"

    # Even if tests fail, report should be generated and emailed
    # Continue execution
fi

echo "" >> "$LOG_FILE"
echo "End time: $(date '+%Y-%m-%d %H:%M:%S')" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

# Show last few lines of log
echo ""
echo -e "${GREEN}📊 Latest test results:${NC}"
tail -n 20 "$LOG_FILE"

echo ""
echo -e "${GREEN}✅ Daily test run completed!${NC}"
echo "📧 Report emailed to: $REPORT_EMAIL"
echo "📝 Full log: $LOG_FILE"
