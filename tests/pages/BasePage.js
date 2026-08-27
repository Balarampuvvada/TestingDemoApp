/**
 * BasePage - Base class for all page objects
 * Provides common utilities and methods used across all pages
 */

class BasePage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL path
   * @param {string} path - The path to navigate to (e.g., '/login', '/admin')
   * @param {object} options - Optional navigation options
   */
  async goto(path, options = {}) {
    await this.page.goto(path, { waitUntil: 'networkidle', ...options });
  }

  /**
   * Check if element is visible
   * @param {string} selector - CSS selector or role selector
   * @param {object} options - Optional visibility check options
   */
  async isElementVisible(selector, options = {}) {
    try {
      const element = this.page.locator(selector);
      return await element.isVisible({ timeout: 5000, ...options });
    } catch {
      return false;
    }
  }

  /**
   * Wait for element to be visible
   * @param {string} selector - CSS selector or role selector
   * @param {number} timeout - Timeout in milliseconds
   */
  async waitForElement(selector, timeout = 5000) {
    await this.page.locator(selector).waitFor({ state: 'visible', timeout });
  }

  /**
   * Click on an element
   * @param {string} selector - CSS selector or role selector
   */
  async clickElement(selector) {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible' });
    await element.click();
  }

  /**
   * Fill input field
   * @param {string} selector - CSS selector or role selector
   * @param {string} text - Text to fill
   */
  async fillInput(selector, text) {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible' });
    await element.fill(text);
  }

  /**
   * Get text content of an element
   * @param {string} selector - CSS selector or role selector
   */
  async getElementText(selector) {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible' });
    return await element.textContent();
  }

  /**
   * Check if element has specific text
   * @param {string} selector - CSS selector or role selector
   * @param {string} text - Text to check for
   */
  async hasText(selector, text) {
    const element = this.page.locator(selector);
    return await element.locator(`text=${text}`).isVisible({ timeout: 5000 }).catch(() => false);
  }

  /**
   * Wait for URL to match pattern
   * @param {RegExp|string} urlPattern - URL pattern to match
   * @param {number} timeout - Timeout in milliseconds
   */
  async waitForURL(urlPattern, timeout = 30000) {
    await this.page.waitForURL(urlPattern, { timeout });
  }

  /**
   * Get current URL
   */
  async getCurrentURL() {
    return this.page.url();
  }

  /**
   * Check if current page title matches
   * @param {RegExp} titlePattern - Title pattern to match
   */
  async hasTitleMatch(titlePattern) {
    await this.page.waitForLoadState('networkidle');
    const title = await this.page.title();
    return titlePattern.test(title);
  }

  /**
   * Wait for API response
   * @param {string} urlPattern - URL pattern to match
   * @param {function} action - Action that triggers the request
   */
  async waitForResponse(urlPattern, action) {
    const responsePromise = this.page.waitForResponse(
      (response) => response.url().includes(urlPattern) && response.ok()
    );
    await action();
    return await responsePromise;
  }

  /**
   * Dismiss or handle alert
   * @param {string} action - 'accept' or 'dismiss'
   */
  async handleAlert(action = 'accept') {
    this.page.once('dialog', async (dialog) => {
      if (action === 'accept') {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
    });
  }

  /**
   * Get and clear clipboard text
   */
  async getClipboardText() {
    return await this.page.evaluate(() => navigator.clipboard.readText());
  }

  /**
   * Take screenshot
   * @param {string} filename - Name for the screenshot file
   */
  async takeScreenshot(filename) {
    await this.page.screenshot({ path: `screenshots/${filename}.png` });
  }
}

module.exports = BasePage;
