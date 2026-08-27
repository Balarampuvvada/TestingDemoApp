/**
 * Page Fixtures - Provides page object instances to tests
 */

const { test: base } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage.js');
const SupervisorDashboard = require('../pages/SupervisorDashboard.js');
const AdminPanel = require('../pages/AdminPanel.js');
const SiteManagementPage = require('../pages/SiteManagementPage.js');

/**
 * Extended test fixture with page objects
 */
const test = base.extend({
  /**
   * Login page fixture
   */
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  /**
   * Supervisor dashboard fixture
   */
  supervisorDashboard: async ({ page }, use) => {
    const supervisorDashboard = new SupervisorDashboard(page);
    await use(supervisorDashboard);
  },

  /**
   * Admin panel fixture
   */
  adminPanel: async ({ page }, use) => {
    const adminPanel = new AdminPanel(page);
    await use(adminPanel);
  },

  /**
   * Site management page fixture
   */
  siteManagementPage: async ({ page }, use) => {
    const siteManagementPage = new SiteManagementPage(page);
    await use(siteManagementPage);
  },

  /**
   * Authenticated supervisor fixture
   * Pre-logs in as supervisor before each test
   */
  supervisorAuth: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    const testData = require('./testData.js');

    // Navigate and login
    await loginPage.navigateToLogin();
    await loginPage.login(testData.users.supervisor.email, testData.users.supervisor.password);

    // Wait for redirect
    await page.waitForURL(/\/supervisor/, { timeout: 30000 });

    const supervisorDashboard = new SupervisorDashboard(page);
    await use(supervisorDashboard);

    // Cleanup - logout if still on supervisor dashboard
    try {
      await page.goto('/supervisor');
      if (await supervisorDashboard.logoutButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await supervisorDashboard.logout();
      }
    } catch {
      // Already logged out or page not accessible
    }
  },

  /**
   * Authenticated admin fixture
   * Pre-logs in as supervisor and navigates to admin panel
   */
  adminAuth: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    const supervisorDashboard = new SupervisorDashboard(page);
    const adminPanel = new AdminPanel(page);
    const testData = require('./testData.js');

    // Navigate and login
    await loginPage.navigateToLogin();
    await loginPage.login(testData.users.supervisor.email, testData.users.supervisor.password);

    // Wait for redirect and navigate to admin
    await page.waitForURL(/\/supervisor/, { timeout: 30000 });
    await supervisorDashboard.clickAdminPanel();
    await page.waitForURL(/\/admin/, { timeout: 30000 });

    await use(adminPanel);

    // Cleanup
    try {
      if (await adminPanel.logoutButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await page.goto('/supervisor');
        await supervisorDashboard.logout();
      }
    } catch {
      // Already logged out
    }
  },
});

module.exports = test;
