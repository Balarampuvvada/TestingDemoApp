/**
 * AdminPanel - Page object for admin panel
 * Handles admin panel navigation and interactions
 */

const BasePage = require('./BasePage.js');

class AdminPanel extends BasePage {
  constructor(page) {
    super(page);
    this.adminPanelHeading = this.page.getByRole('heading', { name: /admin panel/i });
    this.siteManagementButton = this.page.getByRole('button', { name: /site management/i });
    this.checkpointManagementButton = this.page.getByRole('button', { name: /checkpoint management/i });
    this.userManagementButton = this.page.getByRole('button', { name: /user management/i });
    this.backButton = this.page.getByRole('button', { name: /back/i });
    this.logoutButton = this.page.getByRole('button', { name: /logout/i });
  }

  /**
   * Navigate to admin panel
   */
  async navigateToAdminPanel() {
    await this.goto('/admin');
    await this.adminPanelHeading.waitFor({ state: 'visible', timeout: 30000 });
  }

  /**
   * Wait for admin panel to load
   */
  async waitForAdminPanelToLoad() {
    await this.adminPanelHeading.waitFor({ state: 'visible', timeout: 30000 });
  }

  /**
   * Click on Site Management
   */
  async clickSiteManagement() {
    await this.siteManagementButton.click();
  }

  /**
   * Click on Checkpoint Management
   */
  async clickCheckpointManagement() {
    await this.checkpointManagementButton.click();
  }

  /**
   * Click on User Management
   */
  async clickUserManagement() {
    await this.userManagementButton.click();
  }

  /**
   * Click back button
   */
  async clickBack() {
    await this.backButton.click();
  }

  /**
   * Verify all admin options are visible
   */
  async verifyAdminOptions() {
    await this.waitForAdminPanelToLoad();
    const siteManagementVisible = await this.siteManagementButton.isVisible({ timeout: 5000 }).catch(() => false);
    const checkpointManagementVisible = await this.checkpointManagementButton.isVisible({ timeout: 5000 }).catch(() => false);
    const userManagementVisible = await this.userManagementButton.isVisible({ timeout: 5000 }).catch(() => false);
    return siteManagementVisible && checkpointManagementVisible && userManagementVisible;
  }
}

module.exports = AdminPanel;
