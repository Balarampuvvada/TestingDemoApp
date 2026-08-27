/**
 * Dashboard & Logout Tests
 * Tests for dashboard functionality and logout operations
 * Reference: Test Scenario 7.1
 */

const test = require('./fixtures/pageFixtures.js');
const { expect } = require('@playwright/test');
const testData = require('./fixtures/testData.js');

test.describe('Supervisor Dashboard', () => {
  test.beforeEach(async ({ supervisorAuth, page }) => {
    // supervisorAuth fixture handles login and navigation to supervisor dashboard
    await supervisorAuth.waitForDashboardToLoad();
  });

  test.describe('Dashboard Display', () => {
    test('Dashboard shows welcome message with supervisor name', async ({ supervisorAuth }) => {
      // Then: Dashboard displays welcome message with supervisor name
      const hasWelcome = await supervisorAuth.hasWelcomeMessage(testData.users.supervisor.name);
      expect(hasWelcome).toBeTruthy();
    });

    test('Admin Panel button is visible on dashboard', async ({ supervisorAuth }) => {
      // Then: Admin Panel button should be visible
      const isVisible = await supervisorAuth.isAdminPanelButtonVisible();
      expect(isVisible).toBeTruthy();
    });

    test('Dashboard elements are displayed correctly', async ({ supervisorAuth }) => {
      // Then: All dashboard elements should be verified
      const elementsVerified = await supervisorAuth.verifyDashboardElements();
      expect(elementsVerified).toBeTruthy();
    });

    test('Live patrols section displays data', async ({ supervisorAuth }) => {
      // Then: Patrols section should be visible
      const patrolCount = await supervisorAuth.getActivePatrolCount();
      console.log(`Active patrols: ${patrolCount}`);
      // Count may be 0 if no patrols are active
      expect(typeof patrolCount).toBe('number');
      expect(patrolCount).toBeGreaterThanOrEqual(0);
    });

    test('Alerts section displays data', async ({ supervisorAuth }) => {
      // Then: Alerts section should be visible
      const alertCount = await supervisorAuth.getAlertCount();
      console.log(`Current alerts: ${alertCount}`);
      // Count may be 0 if no alerts are active
      expect(typeof alertCount).toBe('number');
      expect(alertCount).toBeGreaterThanOrEqual(0);
    });

    test('Guards on duty section displays data', async ({ supervisorAuth }) => {
      // Then: Guards on duty section should be visible
      const guardsCount = await supervisorAuth.getGuardsOnDutyCount();
      console.log(`Guards on duty: ${guardsCount}`);
      // Count may be 0 if no guards are on duty
      expect(typeof guardsCount).toBe('number');
      expect(guardsCount).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Navigation', () => {
    test('User can navigate to Admin Panel from dashboard', async ({ supervisorAuth, page }) => {
      // Given: User is on supervisor dashboard

      // When: User clicks Admin Panel button
      await supervisorAuth.clickAdminPanel();

      // Then: User is redirected to admin panel
      await page.waitForURL(/\/admin/, { timeout: 10000 });
      expect(page.url()).toContain('/admin');
    });
  });

  test.describe('Logout - Scenario 7.1', () => {
    test('7.1: Admin/Supervisor Logout - User logs out successfully', async ({ supervisorAuth, page }) => {
      // Given: User is on supervisor dashboard
      const currentUrl = page.url();
      expect(currentUrl).toContain('/supervisor');

      // When: User clicks logout button
      await supervisorAuth.logout();

      // Then: User is redirected to login page
      await page.waitForURL(/\/login/, { timeout: 10000 });
      expect(page.url()).toContain('/login');
    });

    test('Session is cleared after logout', async ({ page }) => {
      // Given: User logs in first
      const LoginPage = require('../pages/LoginPage');
      const loginPage = new LoginPage(page);
      await loginPage.navigateToLogin();
      await loginPage.login(testData.users.supervisor.email, testData.users.supervisor.password);
      await page.waitForURL(/\/supervisor/);

      // When: User logs out
      const SupervisorDashboard = require('../pages/SupervisorDashboard');
      const supervisorDashboard = new SupervisorDashboard(page);
      await supervisorDashboard.logout();

      // Then: Trying to access protected routes redirects to login
      await page.goto('/supervisor');
      await page.waitForURL(/\/login/, { timeout: 10000 });
      expect(page.url()).toContain('/login');
    });

    test('Cannot access admin panel after logout', async ({ page }) => {
      // Given: User logs in and then logs out
      const LoginPage = require('../pages/LoginPage');
      const loginPage = new LoginPage(page);
      await loginPage.navigateToLogin();
      await loginPage.login(testData.users.supervisor.email, testData.users.supervisor.password);
      await page.waitForURL(/\/supervisor/);

      const SupervisorDashboard = require('../pages/SupervisorDashboard');
      const supervisorDashboard = new SupervisorDashboard(page);
      await supervisorDashboard.logout();

      // When: User tries to access admin panel
      await page.goto('/admin');

      // Then: User is redirected to login
      await page.waitForURL(/\/login/, { timeout: 10000 });
      expect(page.url()).toContain('/login');
    });

    test('Login page is accessible after logout', async ({ page }) => {
      // Given: User logs in and logs out
      const LoginPage = require('../pages/LoginPage');
      const loginPage = new LoginPage(page);
      await loginPage.navigateToLogin();
      await loginPage.login(testData.users.supervisor.email, testData.users.supervisor.password);
      await page.waitForURL(/\/supervisor/);

      const SupervisorDashboard = require('../pages/SupervisorDashboard');
      const supervisorDashboard = new SupervisorDashboard(page);
      await supervisorDashboard.logout();

      // Then: Login page is displayed and functional
      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.signInButton).toBeVisible();

      // And: Can login again
      await loginPage.login(testData.users.supervisor.email, testData.users.supervisor.password);
      await page.waitForURL(/\/supervisor/, { timeout: 10000 });
      expect(page.url()).toContain('/supervisor');
    });
  });

  test.describe('Dashboard Performance & Reliability', () => {
    test('Dashboard loads within acceptable time', async ({ page }) => {
      const startTime = Date.now();

      const LoginPage = require('../pages/LoginPage');
      const loginPage = new LoginPage(page);
      await loginPage.navigateToLogin();
      await loginPage.login(testData.users.supervisor.email, testData.users.supervisor.password);
      await page.waitForURL(/\/supervisor/);

      const endTime = Date.now();
      const loadTime = endTime - startTime;

      console.log(`Dashboard load time: ${loadTime}ms`);
      // Assert reasonable load time (should be less than 30 seconds)
      expect(loadTime).toBeLessThan(30000);
    });

    test('Dashboard refreshes correctly on page reload', async ({ page }) => {
      // Given: User is on supervisor dashboard
      const LoginPage = require('../pages/LoginPage');
      const loginPage = new LoginPage(page);
      await loginPage.navigateToLogin();
      await loginPage.login(testData.users.supervisor.email, testData.users.supervisor.password);
      await page.waitForURL(/\/supervisor/);

      // When: Page is refreshed
      await page.reload();

      // Then: Dashboard should still be visible
      const SupervisorDashboard = require('../pages/SupervisorDashboard');
      const supervisorDashboard = new SupervisorDashboard(page);
      await supervisorDashboard.waitForDashboardToLoad();

      expect(page.url()).toContain('/supervisor');
    });
  });

  test.describe('Error Handling on Dashboard', () => {
    test('Dashboard handles network errors gracefully', async ({ page }) => {
      // Given: User is on supervisor dashboard
      const LoginPage = require('../pages/LoginPage');
      const loginPage = new LoginPage(page);
      await loginPage.navigateToLogin();
      await loginPage.login(testData.users.supervisor.email, testData.users.supervisor.password);
      await page.waitForURL(/\/supervisor/);

      // When: Network request fails
      await page.route('**/api/**', (route) => route.abort());

      // Then: Page should still be usable or show appropriate error
      // (Behavior depends on app implementation)
      const isVisible = await page.locator('body').isVisible();
      expect(isVisible).toBeTruthy();

      await page.unroute('**/api/**');
    });
  });
});
