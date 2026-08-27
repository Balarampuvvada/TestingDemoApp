/**
 * LoginPage - Page object for login page
 * Handles authentication flows and login interactions
 */

const BasePage = require('./BasePage.js');

class LoginPage extends BasePage {
  // Selectors
  constructor(page) {
    super(page);
    this.emailInput = this.page.getByPlaceholder(/email address/i);
    this.passwordInput = this.page.getByPlaceholder(/password/i);
    this.signInButton = this.page.getByRole('button', { name: /sign in/i });
    this.pageTitle = this.page.getByRole('heading', { name: /security patrol/i });
    this.errorMessage = this.page.locator('[role="alert"]');
    this.loginForm = this.page.locator('form');
  }

  /**
   * Navigate to login page
   * @param {number} maxRetries - Maximum number of retries for loading
   */
  async navigateToLogin(maxRetries = 3) {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.page.goto('/login', { waitUntil: 'networkidle' });

        if (response && !response.ok()) {
          throw new Error(`HTTP ${response.status()} - Server may be unavailable`);
        }

        await this.emailInput.waitFor({ state: 'visible', timeout: 60000 });
        await this.passwordInput.waitFor({ state: 'visible' });
        await this.signInButton.waitFor({ state: 'visible' });
        return; // Success
      } catch (error) {
        lastError = error;
        if (attempt < maxRetries) {
          console.log(`Login page load failed (attempt ${attempt}/${maxRetries}). Retrying in 2s...`);
          await this.page.waitForTimeout(2000);
        }
      }
    }

    throw new Error(
      `Failed to load login page after ${maxRetries} attempts. Last error: ${lastError?.message}`
    );
  }

  /**
   * Enter email address
   * @param {string} email - Email address to enter
   */
  async enterEmail(email) {
    await this.emailInput.fill(email);
  }

  /**
   * Enter password
   * @param {string} password - Password to enter
   */
  async enterPassword(password) {
    await this.passwordInput.fill(password);
  }

  /**
   * Click sign in button
   */
  async clickSignIn() {
    await this.signInButton.click();
  }

  /**
   * Perform login with email and password
   * @param {string} email - Email address
   * @param {string} password - Password
   */
  async login(email, password) {
    await this.navigateToLogin();
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickSignIn();
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
   * Verify login page is loaded
   */
  async verifyLoginPageIsLoaded() {
    await this.emailInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.passwordInput.waitFor({ state: 'visible' });
    await this.signInButton.waitFor({ state: 'visible' });
  }

  /**
   * Check if sign in button is enabled
   */
  async isSignInButtonEnabled() {
    return await this.signInButton.isEnabled();
  }
}

module.exports = LoginPage;
