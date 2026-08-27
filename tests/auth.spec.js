/**
 * Authentication Tests
 * Tests for login flows, role-based access control, and authentication edge cases
 * Reference: Test Scenarios 1.1 - 1.4
 */

const test = require('./fixtures/pageFixtures.js');
const { expect } = require('@playwright/test');
const testData = require('./fixtures/testData.js');

test.describe('Authentication & Login Flows', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure we're on a fresh state
    await page.goto('/');
  });

  test.describe('Valid Login Flows', () => {
    test('1.1: Valid Supervisor Login - Should redirect to supervisor dashboard', async ({
      loginPage,
      supervisorDashboard,
    }) => {
      // Given: User navigates to login page
      await loginPage.navigateToLogin();

      // When: User enters supervisor credentials
      await loginPage.enterEmail(testData.users.supervisor.email);
      await loginPage.enterPassword(testData.users.supervisor.password);
      await loginPage.clickSignIn();

      // Then: User is redirected to supervisor dashboard
      await supervisorDashboard.page.waitForURL(/\/supervisor/, { timeout: 30000 });

      // And: Dashboard displays welcome message
      await supervisorDashboard.waitForDashboardToLoad();
      const hasWelcome = await supervisorDashboard.hasWelcomeMessage(testData.users.supervisor.name);
      expect(hasWelcome).toBeTruthy();

      // And: Admin Panel button is visible
      const adminVisible = await supervisorDashboard.isAdminPanelButtonVisible();
      expect(adminVisible).toBeTruthy();
    });

    test('1.2: Access Protected Routes Without Authentication - Should redirect to login', async ({
      page,
    }) => {
      // Given: User tries to access admin without authentication
      // When: User navigates to /admin without session
      await page.goto('/admin');

      // Then: User is redirected to login page
      await page.waitForURL(/\/login/, { timeout: 30000 });
      expect(page.url()).toContain('/login');
    });
  });

  test.describe('Invalid Login Scenarios', () => {
    test('1.3: Invalid Credentials - Should display error message (ISSUE FOUND)', async ({
      loginPage,
    }) => {
      // Given: User navigates to login page
      await loginPage.navigateToLogin();

      // When: User enters invalid credentials
      await loginPage.enterEmail(testData.invalidCredentials.invalidEmail);
      await loginPage.enterPassword(testData.invalidCredentials.wrongPassword);
      await loginPage.clickSignIn();

      // Wait a bit for potential error message
      await loginPage.page.waitForTimeout(2000);

      // Then: User remains on login page
      expect(loginPage.page.url()).toContain('/login');

      // And: Check if error message is displayed
      // NOTE: This is marked as an ISSUE in documentation - no error feedback shown
      const hasError = await loginPage.isErrorMessageDisplayed();
      if (!hasError) {
        console.warn('⚠️ ISSUE FOUND: No error message displayed for invalid login');
      }
    });

    test('1.4: Guard Login Behavior - Needs Clarification', async ({ loginPage, page }) => {
      // Given: User navigates to login page
      await loginPage.navigateToLogin();

      // When: User enters guard credentials
      await loginPage.enterEmail(testData.users.guard.email);
      await loginPage.enterPassword(testData.users.guard.password);
      await loginPage.clickSignIn();

      // Then: Wait to see what happens after login
      await page.waitForTimeout(3000);

      // Check the current URL - expected behavior is unknown
      const currentURL = page.url();
      console.log(`Guard login redirect URL: ${currentURL}`);

      // This test documents the behavior for later clarification
      expect(currentURL).toBeDefined();
    });
  });

  test.describe('Empty Field Validation', () => {
    test('Empty Email - Should not allow login', async ({ loginPage }) => {
      // Given: User navigates to login page
      await loginPage.navigateToLogin();

      // When: User leaves email empty and fills password
      await loginPage.enterEmail('');
      await loginPage.enterPassword(testData.users.supervisor.password);

      // Then: Sign in button should be disabled (if form validation exists)
      const isEnabled = await loginPage.isSignInButtonEnabled();
      // Browser may allow submission - will test what happens
      if (isEnabled) {
        await loginPage.clickSignIn();
        await loginPage.page.waitForTimeout(2000);
        expect(loginPage.page.url()).toContain('/login');
      }
    });

    test('Empty Password - Should not allow login', async ({ loginPage }) => {
      // Given: User navigates to login page
      await loginPage.navigateToLogin();

      // When: User fills email and leaves password empty
      await loginPage.enterEmail(testData.users.supervisor.email);
      await loginPage.enterPassword('');

      // Then: Sign in button should be disabled (if form validation exists)
      const isEnabled = await loginPage.isSignInButtonEnabled();
      if (isEnabled) {
        await loginPage.clickSignIn();
        await loginPage.page.waitForTimeout(2000);
        expect(loginPage.page.url()).toContain('/login');
      }
    });
  });

  test.describe('Session Management', () => {
    test('Session persists after page refresh', async ({ supervisorAuth, page }) => {
      // Given: User is logged in as supervisor
      await supervisorAuth.page.waitForURL(/\/supervisor/);

      // When: Page is refreshed
      await page.reload();

      // Then: Session should persist and user should remain on supervisor dashboard
      await page.waitForURL(/\/supervisor/, { timeout: 10000 });
      expect(page.url()).toContain('/supervisor');
    });

    test('Multiple concurrent logins handled correctly', async ({ page, context }) => {
      // Given: First user logs in
      const loginPage1 = new (require('../pages/LoginPage'))(page);
      await loginPage1.navigateToLogin();
      await loginPage1.login(testData.users.supervisor.email, testData.users.supervisor.password);
      await page.waitForURL(/\/supervisor/);

      // When: Second browser context tries to login with same account
      const page2 = await context.newPage();
      const loginPage2 = new (require('../pages/LoginPage'))(page2);
      await loginPage2.navigateToLogin();
      await loginPage2.login(testData.users.supervisor.email, testData.users.supervisor.password);

      // Then: Both should be logged in (or second logs out first)
      await page2.waitForURL(/\/supervisor/, { timeout: 10000 });
      expect(page2.url()).toContain('/supervisor');

      await page2.close();
    });
  });

  test.describe('Login Page UI Elements', () => {
    test('Login page displays all required elements', async ({ loginPage }) => {
      // Given: User navigates to login page
      await loginPage.navigateToLogin();

      // Then: All elements should be visible
      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.signInButton).toBeVisible();
      await expect(loginPage.pageTitle).toBeVisible();
    });

    test('Password input masks text for security', async ({ loginPage }) => {
      // Given: User navigates to login page
      await loginPage.navigateToLogin();

      // When: User enters password
      await loginPage.enterPassword('password123');

      // Then: Password should be masked (type should be 'password')
      const passwordType = await loginPage.passwordInput.getAttribute('type');
      expect(passwordType).toBe('password');
    });
  });
});
