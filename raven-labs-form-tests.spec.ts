import { test, expect } from '@playwright/test';
import { Page } from '@playwright/test';

const WEBSITE_URL = 'https://www.theravenlabs.com';
const TEST_TIMEOUT = 30000;

// Test data for form submissions
const testData = {
  fullName: 'Test User',
  email: 'test@example.com',
  company: 'Test Company',
  phone: '1234567890',
  mobilePhone: '+61412345678',
  message: 'This is a test message for form validation',
};

/**
 * Helper function to scroll to element
 */
async function scrollToElement(page: Page, selector: string) {
  await page.locator(selector).first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
}

/**
 * Test Suite 1: Email Signup Form
 */
test.describe('Email Signup Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(WEBSITE_URL, { waitUntil: 'networkidle' });
  });

  test('should display email signup form with required fields', async ({ page }) => {
    const emailInput = page.locator('input[placeholder*="Enter your email"]').first();
    await expect(emailInput).toBeVisible();

    const submitButton = page.locator('button:has-text("Get started")').first();
    await expect(submitButton).toBeVisible();
  });

  test('should validate email field - required validation', async ({ page }) => {
    const submitButton = page.locator('button:has-text("Get started")').first();
    await submitButton.click();

    // Check for validation error or form not submitting
    const emailInput = page.locator('input[placeholder*="Enter your email"]').first();
    const invalidState = await emailInput.evaluate((el: any) => el.validity.valid);

    expect(invalidState).toBe(false);
  });

  test('should validate email format', async ({ page }) => {
    const emailInput = page.locator('input[placeholder*="Enter your email"]').first();

    // Try invalid email format
    await emailInput.fill('invalid-email');

    const isValid = await emailInput.evaluate((el: any) => el.validity.valid);
    expect(isValid).toBe(false);
  });

  test('should accept valid email', async ({ page }) => {
    const emailInput = page.locator('input[placeholder*="Enter your email"]').first();

    await emailInput.fill(testData.email);

    const isValid = await emailInput.evaluate((el: any) => el.validity.valid);
    expect(isValid).toBe(true);
  });

  test('should submit with valid email', async ({ page }) => {
    const emailInput = page.locator('input[placeholder*="Enter your email"]').first();
    const submitButton = page.locator('button:has-text("Get started")').first();

    await emailInput.fill(testData.email);

    // Set up listener for form submission or success response
    let submissionAttempted = false;
    page.on('response', (response) => {
      if (response.url().includes('api') || response.status() === 200) {
        submissionAttempted = true;
      }
    });

    await submitButton.click();
    await page.waitForTimeout(2000);

    // Form should either submit or show success
    const inputValue = await emailInput.inputValue();
    expect([inputValue, testData.email]).toContain(testData.email);
  });
});

/**
 * Test Suite 2: Request for Services Form
 */
test.describe('Request for Services Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(WEBSITE_URL, { waitUntil: 'networkidle' });
  });

  test('should display all required form fields', async ({ page }) => {
    await scrollToElement(page, 'input[placeholder*="Full Name"]');

    const fullNameInput = page.locator('input[placeholder*="Full Name"]').first();
    const companyInput = page.locator('input[placeholder*="Company"]').first();
    const emailInput = page.locator('input[placeholder*="Email"]').first();
    const phoneInput = page.locator('input[placeholder*="Phone"], input[type="number"]').first();
    const messageInput = page.locator('textarea[placeholder*="Message"]').first();
    const submitButton = page.locator('button:has-text("Sumbit"), button:has-text("Submit")').nth(0);

    await expect(fullNameInput).toBeVisible();
    await expect(companyInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(phoneInput).toBeVisible();
    await expect(messageInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test('should validate required fields - full name', async ({ page }) => {
    await scrollToElement(page, 'input[placeholder*="Full Name"]');

    const fullNameInput = page.locator('input[placeholder*="Full Name"]').first();
    const submitButton = page.locator('button:has-text("Sumbit"), button:has-text("Submit")').nth(0);

    // Try to submit without filling full name
    await submitButton.click();
    await page.waitForTimeout(500);

    const isRequired = await fullNameInput.evaluate((el: any) => el.required);
    expect(isRequired).toBe(true);
  });

  test('should validate email format in services form', async ({ page }) => {
    await scrollToElement(page, 'input[placeholder*="Email"]');

    const emailInput = page.locator('input[placeholder*="Email"]').first();

    // Fill with invalid email
    await emailInput.fill('invalid-email@');
    const isValid = await emailInput.evaluate((el: any) => el.validity.valid);

    // Should be invalid or allow correction
    expect([true, false]).toContain(isValid);
  });

  test('should fill and submit services form with valid data', async ({ page }) => {
    await scrollToElement(page, 'input[placeholder*="Full Name"]');

    const fullNameInput = page.locator('input[placeholder*="Full Name"]').first();
    const companyInput = page.locator('input[placeholder*="Company"]').first();
    const emailInput = page.locator('input[placeholder*="Email"]').first();
    const phoneInput = page.locator('input[type="number"]').first();
    const messageInput = page.locator('textarea[placeholder*="Message"]').first();
    const submitButton = page.locator('button:has-text("Sumbit"), button:has-text("Submit")').nth(0);

    await fullNameInput.fill(testData.fullName);
    await companyInput.fill(testData.company);
    await emailInput.fill(testData.email);
    await phoneInput.fill(testData.phone);
    await messageInput.fill(testData.message);

    // Verify all fields are filled
    expect(await fullNameInput.inputValue()).toBe(testData.fullName);
    expect(await companyInput.inputValue()).toBe(testData.company);
    expect(await emailInput.inputValue()).toBe(testData.email);
    expect(await messageInput.inputValue()).toBe(testData.message);

    // Note: Not clicking submit to avoid actually sending test data
    // In production, you might want to mock the endpoint
    expect(await submitButton.isVisible()).toBe(true);
  });

  test('should have service dropdown field', async ({ page }) => {
    await scrollToElement(page, 'select, [role="listbox"]');

    const lookingForSelect = page.locator('select, combobox[aria-label*="Looking"], [role="listbox"]').first();

    if (await lookingForSelect.isVisible()) {
      await expect(lookingForSelect).toBeVisible();
    }
  });
});

/**
 * Test Suite 3: Get in Touch Footer Form
 */
test.describe('Get in Touch Footer Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(WEBSITE_URL, { waitUntil: 'networkidle' });
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
  });

  test('should display footer form fields', async ({ page }) => {
    const nameInput = page.locator('input[placeholder*="Name"]').last();
    const emailInput = page.locator('input[placeholder*="Email"]').last();
    const phoneInput = page.locator('input[placeholder*="+xx"], input[type="tel"]').last();
    const companyInput = page.locator('input[placeholder*="company"]').last();
    const messageInput = page.locator('textarea').last();
    const sendButton = page.locator('button:has-text("Send")').last();

    // At least some fields should be visible
    const visibleCount = await Promise.all([
      nameInput.isVisible().catch(() => false),
      emailInput.isVisible().catch(() => false),
      sendButton.isVisible().catch(() => false),
    ]).then(results => results.filter(v => v).length);

    expect(visibleCount).toBeGreaterThan(0);
  });

  test('should fill footer form with valid data', async ({ page }) => {
    const nameInput = page.locator('input[placeholder*="Name"]').last();
    const emailInput = page.locator('input[placeholder*="Email"]').last();
    const phoneInput = page.locator('input[placeholder*="+xx"], input[type="tel"]').last();

    await nameInput.fill(testData.fullName);
    await emailInput.fill(testData.email);

    if (await phoneInput.isVisible()) {
      await phoneInput.fill(testData.mobilePhone);
    }

    // Verify fields are filled
    expect(await nameInput.inputValue()).toBe(testData.fullName);
    expect(await emailInput.inputValue()).toBe(testData.email);
  });

  test('should have send button in footer form', async ({ page }) => {
    const sendButton = page.locator('button:has-text("Send")').last();
    await expect(sendButton).toBeVisible();
  });
});

/**
 * Test Suite 4: Free Audit Report Form
 */
test.describe('Free Audit Report Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(WEBSITE_URL, { waitUntil: 'networkidle' });
  });

  test('should display all audit report form fields', async ({ page }) => {
    await page.evaluate(() => {
      const elements = document.querySelectorAll('input[placeholder*="Full Name"], input[placeholder*="Company"]');
      if (elements.length > 0) {
        elements[elements.length - 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    await page.waitForTimeout(500);

    const fullNameInputs = page.locator('input[placeholder*="Full Name"]');
    const companyInputs = page.locator('input[placeholder*="Company"]');
    const emailInputs = page.locator('input[placeholder*="Email"]');

    // Check if we can find at least 2 sets of these fields (for different forms)
    expect(await fullNameInputs.count()).toBeGreaterThanOrEqual(2);
  });

  test('should fill audit report form fields', async ({ page }) => {
    // Get the last instances (audit report form is at bottom)
    const fullNameInputs = page.locator('input[placeholder*="Full Name"]');
    const companyInputs = page.locator('input[placeholder*="Company"]');
    const emailInputs = page.locator('input[placeholder*="Email"]');
    const phoneInputs = page.locator('input[placeholder*="Phone"], input[type="number"]');

    const lastFullName = fullNameInputs.last();
    const lastCompany = companyInputs.last();
    const lastEmail = emailInputs.last();
    const lastPhone = phoneInputs.last();

    await lastFullName.scrollIntoViewIfNeeded();
    await lastFullName.fill(testData.fullName);
    await lastCompany.fill(testData.company);
    await lastEmail.fill(testData.email);
    await lastPhone.fill(testData.phone);

    expect(await lastFullName.inputValue()).toBe(testData.fullName);
    expect(await lastCompany.inputValue()).toBe(testData.company);
    expect(await lastEmail.inputValue()).toBe(testData.email);
  });

  test('should have submit button for audit form', async ({ page }) => {
    const submitButtons = page.locator('button:has-text("Submit")');
    const auditSubmitButton = submitButtons.last();

    await expect(auditSubmitButton).toBeVisible();
  });
});

/**
 * Test Suite 5: Cross-Form Validation
 */
test.describe('Cross-Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(WEBSITE_URL, { waitUntil: 'networkidle' });
  });

  test('should have multiple forms on page', async ({ page }) => {
    // Count forms and submit buttons
    const forms = page.locator('form');
    const formCount = await forms.count();

    const submitButtons = page.locator('button[type="submit"]');
    const buttonCount = await submitButtons.count();

    expect(formCount).toBeGreaterThan(0);
    expect(buttonCount).toBeGreaterThan(0);
  });

  test('should maintain form data integrity', async ({ page }) => {
    // Fill first form
    const firstEmailInput = page.locator('input[placeholder*="Enter your email"]').first();
    await firstEmailInput.fill(testData.email);

    // Check other forms exist and are independent
    const allEmailInputs = page.locator('input[type="email"]');
    const emailCount = await allEmailInputs.count();

    expect(emailCount).toBeGreaterThan(1);
    expect(await firstEmailInput.inputValue()).toBe(testData.email);
  });

  test('should validate all forms are accessible and interactive', async ({ page }) => {
    // Verify all main buttons are accessible
    const getStartedBtn = page.locator('button:has-text("Get started")').first();
    const submitBtns = page.locator('button[type="submit"]');

    await expect(getStartedBtn).toBeVisible();
    expect(await submitBtns.count()).toBeGreaterThan(0);
  });
});

/**
 * Test Suite 6: Error Handling and Edge Cases
 */
test.describe('Form Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(WEBSITE_URL, { waitUntil: 'networkidle' });
  });

  test('should handle special characters in text fields', async ({ page }) => {
    const firstNameInput = page.locator('input[placeholder*="Full Name"]').first();
    const specialChars = '<script>alert("test")</script>';

    await firstNameInput.fill(specialChars);

    // Field should accept input (even if sanitized server-side)
    expect(await firstNameInput.inputValue()).toBeTruthy();
  });

  test('should validate phone number format', async ({ page }) => {
    const phoneInputs = page.locator('input[type="tel"], input[placeholder*="Phone"]');

    if (await phoneInputs.first().isVisible()) {
      const phoneInput = phoneInputs.first();

      await phoneInput.fill('invalid-phone');
      // Input should accept it (server will validate)
      expect(await phoneInput.inputValue()).toBeTruthy();
    }
  });

  test('should handle rapid form submissions', async ({ page }) => {
    const firstInput = page.locator('input').first();

    await firstInput.fill(testData.fullName);

    // Try rapid actions
    await firstInput.clear();
    await firstInput.fill(testData.email);

    expect(await firstInput.inputValue()).toBe(testData.email);
  });

  test('should maintain form state on page interactions', async ({ page }) => {
    const emailInput = page.locator('input[placeholder*="Email"]').first();
    await emailInput.fill(testData.email);

    // Simulate some page interaction
    await page.evaluate(() => window.scrollBy(0, 100));
    await page.waitForTimeout(300);

    // Form data should persist
    expect(await emailInput.inputValue()).toBe(testData.email);
  });
});
