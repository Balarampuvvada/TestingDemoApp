# Security Patrol Tracker - Playwright Automation Framework

A comprehensive, production-ready Page Object Model (POM) based test automation framework for the Guard Management Application using Playwright and JavaScript.

## 🎯 Quick Start

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run all tests
npm test

# Run tests with UI mode (recommended for development)
npm run test:ui

# Run tests in headed mode (see the browser)
npm run test:headed

# View test report
npx playwright show-report
```

## 📖 Documentation

- **[TESTING.md](TESTING.md)** - Complete testing framework guide
- **Test Scenarios** - 40+ documented test cases
- **Page Objects** - Reusable, maintainable test components
- **Fixtures** - Pre-built test setup utilities

## 🏗️ Framework Structure

```
tests/
├── pages/                   # Page Object Model (POM)
│   ├── BasePage.js         # Base class with utilities
│   ├── LoginPage.js        # Login page interactions
│   ├── SupervisorDashboard.js
│   ├── AdminPanel.js
│   └── SiteManagementPage.js
├── fixtures/               # Fixtures and test data
│   ├── testData.js
│   └── pageFixtures.js
├── auth.spec.js            # Authentication tests
├── sites.spec.js           # Site management tests
├── dashboard.spec.js       # Dashboard tests
└── adminPanel.spec.js      # Admin panel tests
```

## 🧪 Test Coverage

- ✅ **Authentication** - Login flows, role-based access
- ✅ **Site Management** - CRUD operations (with known issues documented)
- ✅ **Dashboard** - Supervisor dashboard functionality
- ✅ **Admin Panel** - Admin panel navigation
- ✅ **Error Handling** - Edge cases and validations

## 🔑 Key Features

- 📋 **Page Object Model** - Organized, maintainable test structure
- 🔄 **Reusable Fixtures** - Pre-configured test setup
- 📊 **HTML & Allure Reports** - Rich test reporting
- 🌐 **Multi-Browser** - Chrome, Firefox, Safari support
- 🔧 **CI/CD Ready** - GitHub Actions compatible
- 📚 **Comprehensive Docs** - Detailed API documentation
- 🐛 **Issue Documentation** - Known bugs and findings documented

## 🧬 Page Object Methods

### LoginPage
```javascript
await loginPage.navigateToLogin()
await loginPage.login(email, password)
await loginPage.isErrorMessageDisplayed()
```

### SupervisorDashboard
```javascript
await supervisorDashboard.waitForDashboardToLoad()
await supervisorDashboard.hasWelcomeMessage(name)
await supervisorDashboard.clickAdminPanel()
await supervisorDashboard.logout()
```

### SiteManagementPage
```javascript
await siteManagementPage.getAllSites()
await siteManagementPage.createSite(siteData)
await siteManagementPage.deleteSiteByName(siteName)
await siteManagementPage.viewQRCodesBySiteName(siteName)
```

## 🧪 Running Tests

```bash
# All tests
npm test

# UI Mode (best for development)
npm run test:ui

# Headed mode (watch the browser)
npm run test:headed

# Specific test file
npx playwright test tests/auth.spec.js

# Specific test suite
npx playwright test -g "Authentication"

# Debug mode
npx playwright test --debug

# Generate test code
npm run codegen
```

## 📊 Test Results

Current test implementation covers:
- **8** Authentication tests
- **15** Site Management tests  
- **8** Dashboard & Logout tests
- **6** Admin Panel tests
- **~40** total test cases

## 🐛 Known Issues Found

| Issue | Severity | Impact |
|-------|----------|--------|
| Site Creation Backend Error | 🔴 Critical | HTTP 500 on create |
| No Edit Functionality | 🔴 Critical | Cannot modify sites |
| No Error Feedback | 🟠 High | Invalid login shows no message |
| No Form Validation | 🟠 High | Missing required field checks |
| No Search Feature | 🟠 Medium | Manual scrolling required |

See [TESTING.md](TESTING.md) for detailed issue documentation.

## 📚 Test Credentials

```
Supervisor:
Email: supervisor@security.com
Password: password123

Guard:
Email: guard1@security.com
Password: password123
```

## 🔧 Configuration

- **Base URL:** https://frontend-hrqz.onrender.com
- **Test Timeout:** 30 seconds
- **Retries:** 2 (CI), 0 (Local)
- **Browsers:** Chromium, Firefox, WebKit
- **Reports:** HTML + Allure

See [playwright.config.js](playwright.config.js) for detailed configuration.

## 📖 Application Under Test

**Security Patrol Tracker** - Guard Management & Site Security System
- Frontend: https://frontend-hrqz.onrender.com
- Backend: https://security-patrol-backend.onrender.com
- Roles: Supervisor, Guard, Admin

## 🚀 Next Steps

1. Read the full [TESTING.md](TESTING.md) documentation
2. Review existing tests in `tests/`
3. Run tests with UI mode: `npm run test:ui`
4. Check test reports: `npx playwright show-report`
5. Create new tests following the established patterns

## 📝 Contributing

When adding new tests:
1. Create Page Object for new pages
2. Use BDD format (Given/When/Then)
3. Add test data to `testData.js`
4. Use fixtures for setup
5. Document any bugs found
6. Update this README if needed

## 📞 Support

Refer to:
- [Playwright Documentation](https://playwright.dev)
- [TESTING.md](TESTING.md) - Full framework guide
- Test files for usage examples

---

**Framework Status:** ✅ Ready for Testing  
**Last Updated:** May 13, 2026  
**Version:** 1.0.0

The GitHub Actions workflow runs on every push and pull request. It installs Node dependencies, installs Playwright browsers, runs `npm test`, and uploads the Playwright report plus test results as workflow artifacts.

CI flow:

```text
Developer pushes code
      ↓
GitHub Actions triggers automatically
      ↓
Playwright tests hit https://frontend-hrqz.onrender.com
      ↓
Pass → merge allowed
Fail → developer gets notified in GitHub
```

To block failed pull requests from merging, enable branch protection in GitHub:

```text
Repository → Settings → Branches → Add branch protection rule
Branch name pattern: main
Enable: Require status checks to pass before merging
Select: Run Playwright tests
```

Run headed:

```powershell
npm run test:headed
```

Open Playwright UI:

```powershell
npm run test:ui
```

Generate actions interactively:

```powershell
npm run codegen -- https://frontend-hrqz.onrender.com/login
```

The demo credentials visible on the login page are used by default. You can override them with environment variables:

```powershell
$env:GUARD_EMAIL = 'guard1@security.com'
$env:GUARD_PASSWORD = 'password123'
$env:SUPERVISOR_EMAIL = 'supervisor@security.com'
$env:SUPERVISOR_PASSWORD = 'password123'
npm test
```
