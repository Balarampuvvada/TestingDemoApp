/**
 * SiteManagementPage - Page object for site management
 * Handles site creation, reading, updating, and deletion
 */

const BasePage = require('./BasePage.js');

class SiteManagementPage extends BasePage {
  constructor(page) {
    super(page);
    this.pageHeading = this.page.getByRole('heading', { name: /site management/i });
    this.addSiteButton = this.page.getByRole('button', { name: /add site|create site/i });
    this.sitesList = this.page.locator('[data-testid="sites-list"]');
    this.siteItem = this.page.locator('[data-testid="site-item"]');
    this.siteNameInput = this.page.getByPlaceholder(/site name/i);
    this.siteAddressInput = this.page.getByPlaceholder(/address/i);
    this.latitudeInput = this.page.getByPlaceholder(/latitude/i);
    this.longitudeInput = this.page.getByPlaceholder(/longitude/i);
    this.createSiteButton = this.page.getByRole('button', { name: /create site|submit/i });
    this.cancelButton = this.page.getByRole('button', { name: /cancel|close/i });
    this.deleteButton = this.page.getByRole('button', { name: /delete/i });
    this.viewQRCodesButton = this.page.getByRole('button', { name: /view qr|qr codes/i });
    this.copyTextButton = this.page.getByRole('button', { name: /copy text/i });
    this.searchInput = this.page.getByPlaceholder(/search/i);
    this.confirmDeleteButton = this.page.getByRole('button', { name: /confirm|yes|delete/i });
    this.qrCodesModal = this.page.locator('[role="dialog"]');
    this.successMessage = this.page.locator('text=/success|created|deleted/i');
    this.errorMessage = this.page.locator('[role="alert"]');
  }

  /**
   * Navigate to site management
   */
  async navigateToSiteManagement() {
    await this.goto('/admin/site-management');
    await this.pageHeading.waitFor({ state: 'visible', timeout: 30000 });
  }

  /**
   * Wait for site management page to load
   */
  async waitForSiteManagementToLoad() {
    await this.pageHeading.waitFor({ state: 'visible', timeout: 30000 });
  }

  /**
   * Click add site button
   */
  async clickAddSite() {
    await this.addSiteButton.click();
  }

  /**
   * Fill site creation form
   * @param {object} siteData - Site data object
   */
  async fillSiteForm(siteData) {
    const { siteName, address, latitude, longitude } = siteData;

    if (siteName) {
      await this.siteNameInput.fill(siteName);
    }
    if (address) {
      await this.siteAddressInput.fill(address);
    }
    if (latitude) {
      await this.latitudeInput.fill(latitude.toString());
    }
    if (longitude) {
      await this.longitudeInput.fill(longitude.toString());
    }
  }

  /**
   * Submit site creation form
   */
  async submitSiteForm() {
    await this.createSiteButton.click();
  }

  /**
   * Create a new site
   * @param {object} siteData - Site data object
   */
  async createSite(siteData) {
    await this.clickAddSite();
    await this.fillSiteForm(siteData);
    await this.submitSiteForm();
  }

  /**
   * Get all sites from the list
   */
  async getAllSites() {
    const count = await this.siteItem.count();
    const sites = [];
    for (let i = 0; i < count; i++) {
      const siteName = await this.siteItem.nth(i).getByRole('heading').textContent();
      sites.push(siteName);
    }
    return sites;
  }

  /**
   * Get site count
   */
  async getSiteCount() {
    return await this.siteItem.count();
  }

  /**
   * Delete a site by name
   * @param {string} siteName - Name of the site to delete
   */
  async deleteSiteByName(siteName) {
    const siteElement = this.page.locator(`text=${siteName}`).locator('..').locator('..').getByRole('button', { name: /delete/i });
    await siteElement.click();

    // Handle confirmation dialog
    const confirmButton = this.page.locator('text=/confirm|yes|delete/i').first();
    if (await confirmButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await confirmButton.click();
    }
  }

  /**
   * View QR codes for a site
   * @param {string} siteName - Name of the site
   */
  async viewQRCodesBySiteName(siteName) {
    const siteElement = this.page.locator(`text=${siteName}`).locator('..').locator('..');
    const viewQRButton = siteElement.getByRole('button', { name: /view qr|qr codes/i });
    await viewQRButton.click();
  }

  /**
   * Check if QR codes modal is visible
   */
  async isQRCodesModalVisible() {
    return await this.qrCodesModal.isVisible({ timeout: 5000 }).catch(() => false);
  }

  /**
   * Copy QR codes text
   */
  async copyQRCodesToClipboard() {
    await this.copyTextButton.click();
  }

  /**
   * Close QR codes modal
   */
  async closeQRCodesModal() {
    const closeButton = this.qrCodesModal.getByRole('button', { name: /close|x/i });
    await closeButton.click();
  }

  /**
   * Check if success message is displayed
   */
  async isSuccessMessageDisplayed() {
    try {
      return await this.successMessage.isVisible({ timeout: 5000 });
    } catch {
      return false;
    }
  }

  /**
   * Get success message text
   */
  async getSuccessMessage() {
    try {
      return await this.successMessage.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Check if error message is displayed
   */
  async isErrorMessageDisplayed() {
    try {
      return await this.errorMessage.isVisible({ timeout: 5000 });
    } catch {
      return false;
    }
  }

  /**
   * Get error message text
   */
  async getErrorMessage() {
    try {
      return await this.errorMessage.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Search for a site
   * @param {string} searchTerm - Search term
   */
  async searchSite(searchTerm) {
    if (await this.searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await this.searchInput.fill(searchTerm);
    } else {
      throw new Error('Search functionality not implemented');
    }
  }

  /**
   * Verify site exists in list
   * @param {string} siteName - Site name to verify
   */
  async verifySiteExists(siteName) {
    const sites = await this.getAllSites();
    return sites.includes(siteName);
  }
}

module.exports = SiteManagementPage;
