# Playwright Environment

Automation target:

```text
https://frontend-hrqz.onrender.com
```

Run tests:

```powershell
npm test
```

Run tests automatically on Git push:

```text
.github/workflows/playwright.yml
```

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
