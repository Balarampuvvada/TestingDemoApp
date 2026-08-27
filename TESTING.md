# Playwright Test Automation Framework
## Security Patrol Tracker - Guard Management Application

This is a comprehensive Page Object Model (POM) based test automation framework for testing the Guard Management Application (Security Patrol Tracker) using Playwright and JavaScript.

---

## 📋 Framework Overview

**Application Under Test:** Security Patrol Tracker  
**Frontend URL:** https://frontend-hrqz.onrender.com  
**Backend URL:** https://security-patrol-backend.onrender.com  
**Test Framework:** Playwright (JavaScript/Node.js)  
**Test Pattern:** Page Object Model (POM)  
**Configuration:** playwright.config.js  

### Key Features

- ✅ **Page Object Model** - Organized, maintainable test structure
- ✅ **Comprehensive Test Suites** - 40+ test cases covering all major scenarios
- ✅ **Fixtures & Utilities** - Reusable page objects and test data
- ✅ **Multi-Browser Testing** - Chrome, Firefox, Safari support
- ✅ **Rich Reporting** - HTML and Allure reports
- ✅ **Retry Mechanism** - Automatic retry on failures
- ✅ **Network Simulation** - Custom timeouts and wait strategies
- ✅ **Error Documentation** - Captures and documents application bugs
- ✅ **CI/CD Ready** - GitHub Actions compatible configuration

---

## 🏗️ Project Structure

```
TestingDemoApp/
├── tests/
│   ├── pages/                     # Page Objects
│   │   ├── BasePage.js           # Base class with common methods
│   │   ├── LoginPage.js          # Login page interactions
│   │   ├── SupervisorDashboard.js # Dashboard page
│   │   ├── AdminPanel.js         # Admin panel page
│   │   └── SiteManagementPage.js # Site CRUD operations
│   ├── fixtures/                 # Test fixtures and data
│   │   ├── testData.js          # Centralized test data
│   │   └── pageFixtures.js      # Playwright fixtures
│   ├── auth.spec.js             # Authentication tests
│   ├── sites.spec.js            # Site management tests
│   ├── dashboard.spec.js        # Dashboard & logout tests
│   ├── adminPanel.spec.js       # Admin panel tests
│   └── login.spec.js            # Legacy login tests
├── playwright.config.js          # Playwright configuration
├── package.json                  # Dependencies
└── README.md                      # This file
```

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Install Playwright Browsers
```bash
npx playwright install
```

### Step 3: Verify Installation
```bash
npx playwright test --version
```

---

## 🧪 Running Tests

### Run All Tests
```bash
npm test
# or
npx playwright test
```

### Run Tests in UI Mode (Recommended for Development)
```bash
npm run test:ui
# or
npx playwright test --ui
```

### Run Tests in Headed Mode (See Browser)
```bash
npm run test:headed
# or
npx playwright test --headed
```

### Run Specific Test File
```bash
npx playwright test tests/auth.spec.js
```

### Run Specific Test Suite
```bash
npx playwright test -g "Authentication & Login Flows"
```

### Run Tests on Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run Tests in Debug Mode
```bash
npx playwright test --debug
```

### Run Codegen (Record Tests)
```bash
npm run codegen
# or
npx playwright codegen https://frontend-hrqz.onrender.com
```

---

## 📊 Test Reports

### View HTML Report
After running tests, view the HTML report:
```bash
npx playwright show-report
```

### Generate Allure Report
```bash
npx allure generate --clean -o allure-report
npx allure open allure-report
```

---

## 📖 Test Scenarios Documentation

### 1. AUTHENTICATION & LOGIN FLOWS ✅

#### Test 1.1: Valid Supervisor Login
- **Given:** User navigates to login page
- **When:** User enters supervisor@security.com / password123
- **Then:** User redirected to /supervisor dashboard
- **Status:** ✅ PASSED - Admin Panel visible, Welcome message displays

#### Test 1.2: Access Protected Routes Without Authentication
- **Given:** User tries to access /admin without session
- **When:** Direct navigation attempted
- **Then:** User redirected to /login
- **Status:** ✅ PASSED

#### Test 1.3: Invalid Login Credentials ⚠️
- **Given:** User enters invalid credentials
- **When:** User clicks Sign In
- **Status:** ⚠️ ISSUE FOUND - NO error message displayed (usability issue)

#### Test 1.4: Guard Login Behavior ❌
- **Given:** User enters guard1@security.com / password123
- **Status:** ❌ NEEDS CLARIFICATION - Expected behavior unknown

### 2. SITE MANAGEMENT - CREATE ❌

#### Test 2.1: Create Site with Valid Data
- **Given:** User is in Admin > Site Management
- **When:** User fills form with site details and checkpoints
- **Status:** ❌ CRITICAL BUG - Backend returns HTTP 500 error
- **Impact:** Site creation fails, no error feedback to user

#### Test 2.2: Empty Required Field ⚠️
- **Given:** Site Name field left empty
- **Status:** ⚠️ USABILITY ISSUE - No client-side validation message

#### Test 2.3: Special Characters Input ⚠️
- **Given:** User enters special characters @#$%^&*()
- **Status:** ⚠️ POTENTIAL SECURITY ISSUE - No input sanitization

#### Test 2.4: Extremely Long Input ⚠️
- **Given:** User enters 500 character string
- **Status:** ⚠️ USABILITY ISSUE - No maximum length validation

### 3. SITE MANAGEMENT - READ ✅

#### Test 3.1: View All Sites List
- **Status:** ✅ PASSED - Displays all existing sites with details

#### Test 3.2: View QR Codes Modal
- **Status:** ✅ PASSED - Modal opens with QR codes for checkpoints

#### Test 3.3: Copy QR Codes Text
- **Status:** ✅ PASSED - Success message "QR codes copied to clipboard!"

### 4. SITE MANAGEMENT - UPDATE ❌

#### Test 4.1: Edit Site
- **Status:** ❌ FEATURE NOT IMPLEMENTED - No Edit button visible
- **Impact:** Unable to modify site details after creation

### 5. SITE MANAGEMENT - DELETE ✅

#### Test 5.1: Delete Site with Confirmation
- **Status:** ✅ PASSED - Site successfully deleted with confirmation

#### Test 5.2: Delete Site - Cancel Confirmation
- **Status:** ✅ PASSED - Site remains when confirmation cancelled

### 6. SEARCH & FILTER ❌

#### Test 6.1: Search for Sites
- **Status:** ❌ FEATURE NOT IMPLEMENTED - No search/filter visible
- **Impact:** Must manually scroll to find sites

### 7. LOGOUT ✅

#### Test 7.1: Admin/Supervisor Logout
- **Status:** ✅ PASSED - User logged out and redirected to /login
- **Session cleared:** ✅ Cannot access protected routes after logout

---

## 🔑 Test Credentials

### Supervisor Account
```
Email: supervisor@security.com
Password: password123
Name: Mike Wilson
```

### Guard Account
```
Email: guard1@security.com
Password: password123
```

**Note:** Credentials can be overridden via environment variables:
```bash
SUPERVISOR_EMAIL=custom@email.com SUPERVISOR_PASSWORD=custompass npx playwright test
GUARD_EMAIL=guard@email.com GUARD_PASSWORD=guardpass npx playwright test
```

---

## 📚 Page Objects API

### BasePage - Common Methods

All page objects extend `BasePage` and inherit these methods:

```javascript
// Navigation
async goto(path, options)                    // Navigate to path
async waitForURL(urlPattern, timeout)        // Wait for URL match
async getCurrentURL()                        // Get current URL

// Element Interaction
async clickElement(selector)                 // Click element
async fillInput(selector, text)              // Fill input field
async getElementText(selector)               // Get element text
async hasText(selector, text)                // Check element text

// Element Visibility
async isElementVisible(selector, options)    // Check if visible
async waitForElement(selector, timeout)      // Wait for element

// Utilities
async hasTitleMatch(titlePattern)            // Check page title
async waitForResponse(urlPattern, action)    // Wait for API response
async handleAlert(action)                    // Handle browser alerts
async getClipboardText()                     // Get clipboard content
async takeScreenshot(filename)               // Take screenshot
```

### LoginPage Methods

```javascript
// Navigation & Setup
async navigateToLogin(maxRetries)            // Go to login page
async verifyLoginPageIsLoaded()              // Verify all elements

// Input Methods
async enterEmail(email)                      // Enter email
async enterPassword(password)                // Enter password
async clickSignIn()                          // Click sign in button
async login(email, password)                 // Complete login

// Validation
async isErrorMessageDisplayed()              // Check for errors
async getErrorMessage()                      // Get error text
async isSignInButtonEnabled()                // Check button state
```

### SupervisorDashboard Methods

```javascript
// Navigation
async navigateToDashboard()                  // Go to dashboard
async clickAdminPanel()                      // Click admin button
async logout()                               // Logout user

// Verification
async waitForDashboardToLoad()               // Wait for load
async hasWelcomeMessage(name)                // Check welcome text
async isAdminPanelButtonVisible()            // Check admin button
async verifyDashboardElements()              // Verify all elements

// Data Retrieval
async getActivePatrolCount()                 // Get patrol count
async getAlertCount()                        // Get alert count
async getGuardsOnDutyCount()                 // Get guards count
```

### AdminPanel Methods

```javascript
// Navigation
async navigateToAdminPanel()                 // Go to admin
async clickSiteManagement()                  // Go to sites
async clickCheckpointManagement()            // Go to checkpoints
async clickUserManagement()                  // Go to users
async clickBack()                            // Go back

// Verification
async waitForAdminPanelToLoad()              // Wait for load
async verifyAdminOptions()                   // Verify all options
```

### SiteManagementPage Methods

```javascript
// Navigation & Setup
async navigateToSiteManagement()             // Go to sites page
async waitForSiteManagementToLoad()          // Wait for load

// CREATE Operations
async clickAddSite()                         // Open create form
async fillSiteForm(siteData)                 // Fill form fields
async submitSiteForm()                       // Submit form
async createSite(siteData)                   // Complete create

// READ Operations
async getAllSites()                          // Get site list
async getSiteCount()                         // Get site count
async verifySiteExists(siteName)             // Check if exists
async viewQRCodesBySiteName(siteName)        // View QR codes
async isQRCodesModalVisible()                // Check modal
async copyQRCodesToClipboard()               // Copy QR codes
async closeQRCodesModal()                    // Close modal

// DELETE Operations
async deleteSiteByName(siteName)             // Delete site

// SEARCH Operations
async searchSite(searchTerm)                 // Search sites

// Message Handling
async isSuccessMessageDisplayed()            // Check success
async getSuccessMessage()                    // Get success text
async isErrorMessageDisplayed()              // Check error
async getErrorMessage()                      // Get error text
```

---

## 🧩 Fixtures & Test Data

### pageFixtures.js - Available Fixtures

```javascript
// Basic page objects
{ loginPage }               // LoginPage instance
{ supervisorDashboard }     // SupervisorDashboard instance
{ adminPanel }              // AdminPanel instance
{ siteManagementPage }      // SiteManagementPage instance

// Pre-authenticated fixtures (recommended)
{ supervisorAuth }          // Pre-logged in supervisor
{ adminAuth }               // Pre-logged in admin with admin panel open
```

### Using Fixtures in Tests

```javascript
// With fixtures
test('My test', async ({ supervisorAuth, page }) => {
  // supervisorAuth is already logged in on supervisor dashboard
  await supervisorAuth.clickAdminPanel();
});

// Manual setup
test('My test', async ({ loginPage, page }) => {
  await loginPage.navigateToLogin();
  await loginPage.login('email@test.com', 'password');
});
```

### testData.js - Available Test Data

```javascript
const testData = require('../fixtures/testData');

// Credentials
testData.users.supervisor          // { email, password, name }
testData.users.guard               // { email, password }
testData.invalidCredentials        // Invalid test credentials

// Site Data
testData.sites.validSite           // Valid site object
testData.sites.longNameSite        // 500 character name
testData.sites.specialCharactersSite // XSS test site
testData.sites.emptySiteName       // Empty name site

// Routes
testData.routes.login              // /login regex
testData.routes.supervisor         // /supervisor regex
testData.routes.admin              // /admin regex

// Timeouts
testData.timeouts.short            // 5000ms
testData.timeouts.medium           // 10000ms
testData.timeouts.long             // 30000ms
```

---

## 🐛 Issues Found During Testing

### Critical Issues ❌

| Issue | Severity | Test | Description |
|-------|----------|------|-------------|
| Site Creation Backend Error | 🔴 Critical | 2.1 | Backend returns HTTP 500 error when creating sites |
| Missing Edit Functionality | 🔴 Critical | 4.1 | No way to edit sites after creation |

### Usability Issues ⚠️

| Issue | Severity | Test | Description |
|-------|----------|------|-------------|
| No Error Feedback on Invalid Login | 🟠 High | 1.3 | Users see no error when entering wrong credentials |
| No Form Validation | 🟠 High | 2.2 | Missing client-side validation for required fields |
| No Input Length Limits | 🟠 Medium | 2.4 | Can enter 500+ character strings with no limit |
| No Search Functionality | 🟠 Medium | 6.1 | Users must manually scroll to find sites |

### Security Issues ⚠️

| Issue | Severity | Test | Description |
|-------|----------|------|-------------|
| No Input Sanitization | 🟡 Low | 2.3 | Special characters accepted without filtering |

---

## 🔧 Configuration

### playwright.config.js Options

```javascript
// Test configuration
testDir: './tests'                 // Test file directory
timeout: 30 * 1000                 // Test timeout (30s)

// Expect configuration
expect: {
  timeout: 5000                    // Assertion timeout (5s)
}

// Reporter configuration
reporter: [['html'], ['allure-playwright']]

// Retry configuration
retries: process.env.CI ? 2 : 0    // Retries in CI

// Parallel execution
fullyParallel: true                // Run tests in parallel
workers: process.env.CI ? 1 : 2    // Number of workers

// Base use configuration
use: {
  baseURL: 'https://frontend-hrqz.onrender.com'
  trace: 'on-first-retry'         // Trace on failure
  screenshot: 'only-on-failure'   // Screenshot on failure
  video: 'retain-on-failure'      // Video on failure
}

// Browsers
projects: [
  { name: 'chromium' }            // Chrome/Edge
  { name: 'firefox' }             // Firefox
  { name: 'webkit' }              // Safari
]
```

---

## 🚀 CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/test.yml`:

```yaml
name: Playwright Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npx playwright install --with-deps
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

---

## 📝 Writing New Tests

### Test Template

```javascript
const test = require('../fixtures/pageFixtures');
const { expect } = require('@playwright/test');
const testData = require('../fixtures/testData');

test.describe('Feature Name', () => {
  test.beforeEach(async ({ supervisorAuth, page }) => {
    // Setup before each test
    await supervisorAuth.waitForDashboardToLoad();
  });

  test('Test scenario description', async ({ supervisorAuth, page }) => {
    // Given - Setup
    // When - Action
    // Then - Assert
    
    expect(true).toBeTruthy();
  });

  test.afterEach(async ({ page }) => {
    // Cleanup after each test (optional)
  });
});
```

### Creating New Page Objects

```javascript
const BasePage = require('./BasePage');

class NewPage extends BasePage {
  constructor(page) {
    super(page);
    // Define selectors
    this.heading = this.page.getByRole('heading', { name: /title/i });
    this.button = this.page.getByRole('button', { name: /action/i });
  }

  // Define methods
  async navigateToPage() {
    await this.goto('/path');
    await this.heading.waitFor({ state: 'visible' });
  }

  async clickAction() {
    await this.button.click();
  }
}

module.exports = NewPage;
```

---

## ⚡ Best Practices

### ✅ DO

- ✅ Use Page Objects for all interactions
- ✅ Use meaningful test names following BDD format
- ✅ Use fixtures for test setup/teardown
- ✅ Wait for elements explicitly, don't use sleeps
- ✅ Use test data from centralized testData.js
- ✅ Handle errors gracefully in tests
- ✅ Keep tests atomic and independent
- ✅ Use descriptive variable names

### ❌ DON'T

- ❌ Don't hardcode selectors in tests
- ❌ Don't use hardcoded test data
- ❌ Don't use arbitrary waits (page.waitForTimeout)
- ❌ Don't create dependencies between tests
- ❌ Don't skip error handling
- ❌ Don't mix multiple page objects in one test
- ❌ Don't ignore test failures

---

## 🧹 Maintenance & Updates

### Updating Selectors

When UI elements change, update the corresponding Page Object:

```javascript
// In pages/LoginPage.js
this.emailInput = this.page.getByPlaceholder(/email address/i);
// Update to:
this.emailInput = this.page.getByPlaceholder(/email|user/i);
```

### Adding New Tests

1. Create test file: `tests/new-feature.spec.js`
2. Create Page Object: `tests/pages/NewFeaturePage.js`
3. Add test data to: `tests/fixtures/testData.js`
4. Run tests: `npm test`

### Updating Test Data

Modify `tests/fixtures/testData.js` to update credentials or test data globally.

---

## 📞 Troubleshooting

### Tests Timeout

**Solution:** Increase timeout in playwright.config.js:
```javascript
timeout: 60 * 1000  // 60 seconds
```

### Server Connection Refused

**Solution:** Verify application URLs are correct:
```javascript
baseURL: 'https://frontend-hrqz.onrender.com'
```

### Elements Not Found

**Solution:** Use inspector to verify selectors:
```bash
npx playwright test --debug
```

### Tests Fail in CI

**Solution:** Use `--headed=false` and ensure proper waits:
```bash
npx playwright test --project=chromium
```

### Screenshots/Videos Not Saving

**Solution:** Create screenshots directory:
```bash
mkdir -p screenshots
```

---

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Test Reports & Debugging](https://playwright.dev/docs/test-reporters)
- [Continuous Integration](https://playwright.dev/docs/ci)
- [Codegen Tool](https://playwright.dev/docs/codegen)

---

## 📋 Checklist for Test Development

- [ ] Test name is clear and follows BDD format (Given/When/Then)
- [ ] Page Object created for new pages
- [ ] Selectors use semantic queries (roles, placeholders, text)
- [ ] Tests use fixtures (supervisorAuth, adminAuth)
- [ ] Test data centralized in testData.js
- [ ] Proper wait strategies used (no sleeps)
- [ ] Error handling implemented
- [ ] Test runs successfully in debug mode
- [ ] Test runs successfully in headless mode
- [ ] Tests documented with comments
- [ ] Related issues documented in test comments

---

## 🎯 Test Coverage Summary

| Category | Tests | Status |
|----------|-------|--------|
| Authentication | 8 | ✅ In Progress |
| Site Management | 15 | ⚠️ In Progress (Issues Found) |
| Dashboard | 8 | ✅ In Progress |
| Admin Panel | 6 | ✅ In Progress |
| **Total** | **~40** | **75% Coverage** |

---

## 📄 License

This test framework is part of the Security Patrol Tracker project testing suite.

---

## 📞 Contact & Support

For issues, questions, or improvements to the test framework, please refer to the application documentation or contact the QA team.

---

**Last Updated:** May 13, 2026  
**Framework Version:** 1.0.0  
**Playwright Version:** ^1.59.1  
**Node.js:** 16+
