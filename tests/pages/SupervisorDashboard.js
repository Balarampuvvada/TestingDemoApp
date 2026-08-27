/**
 * SupervisorDashboard - Page object for supervisor dashboard
 * Handles supervisor dashboard interactions, alerts, and navigation
 */

const BasePage = require('./BasePage.js');

class SupervisorDashboard extends BasePage {
  constructor(page) {
    super(page);
    this.welcomeMessage = this.page.getByText(/welcome/i);
    this.adminPanelButton = this.page.getByRole('button', { name: /admin panel/i });
    this.logoutButton = this.page.getByRole('button', { name: /logout/i });
    this.dashboardHeading = this.page.getByRole('heading', { name: /dashboard|patrol/i });
    this.patrols = this.page.locator('[data-testid="patrol-item"]');
    this.alerts = this.page.locator('[data-testid="alert-item"]');
    this.guardsOnDuty = this.page.locator('[data-testid="guard-on-duty"]');
  }

  /**
   * Navigate to supervisor dashboard
   */
  async navigateToDashboard() {
    await this.goto('/supervisor');
    await this.waitForElement('//h1 | //h2', 30000);
  }

  /**
   * Wait for dashboard to load
   */
  async waitForDashboardToLoad() {
    await this.dashboardHeading.waitFor({ state: 'visible', timeout: 30000 });
  }

  /**
   * Check if welcome message contains supervisor name
   * @param {string} name - Supervisor name to check
   */
  async hasWelcomeMessage(name) {
    const text = await this.welcomeMessage.textContent();
    return text.includes(name);
  }

  /**
   * Verify admin panel button is visible
   */
  async isAdminPanelButtonVisible() {
    return await this.adminPanelButton.isVisible({ timeout: 5000 }).catch(() => false);
  }

  /**
   * Click admin panel button
   */
  async clickAdminPanel() {
    await this.adminPanelButton.click();
  }

  /**
   * Get number of active patrols
   */
  async getActivePatrolCount() {
    return await this.patrols.count();
  }

  /**
   * Get number of alerts
   */
  async getAlertCount() {
    return await this.alerts.count();
  }

  /**
   * Get number of guards on duty
   */
  async getGuardsOnDutyCount() {
    return await this.guardsOnDuty.count();
  }

  /**
   * Verify dashboard elements
   */
  async verifyDashboardElements() {
    await this.waitForDashboardToLoad();
    const adminVisible = await this.isAdminPanelButtonVisible();
    const logoutVisible = await this.logoutButton.isVisible({ timeout: 5000 }).catch(() => false);
    return adminVisible && logoutVisible;
  }

  /**
   * Logout from dashboard
   */
  async logout() {
    await this.logoutButton.click();
    await this.page.waitForURL(/\/login/);
  }
}

module.exports = SupervisorDashboard;
