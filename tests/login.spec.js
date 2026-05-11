const { test, expect } = require('@playwright/test');

const users = {
  guard: {
    email: process.env.GUARD_EMAIL || 'guard1@security.com',
    password: process.env.GUARD_PASSWORD || 'password123',
  },
  supervisor: {
    email: process.env.SUPERVISOR_EMAIL || 'supervisor@security.com',
    password: process.env.SUPERVISOR_PASSWORD || 'password123',
  },
};

const routes = {
  login: /\/login\/?$/,
  guard: /\/guard\/?$/,
  supervisor: /\/supervisor\/?$/,
  admin: /\/admin\/?$/,
};

const backendUrl =
  process.env.BACKEND_URL || 'https://security-patrol-backend.onrender.com';

function emailField(page) {
  return page.getByPlaceholder(/email address/i);
}

function passwordField(page) {
  return page.getByPlaceholder(/password/i);
}

function signInButton(page) {
  return page.getByRole('button', { name: /sign in/i });
}

function logoutButton(page) {
  return page.getByRole('button', { name: /logout/i });
}

async function gotoLogin(page) {
  await page.goto('/login');
  await expect(emailField(page)).toBeVisible({ timeout: 60_000 });
  await expect(passwordField(page)).toBeVisible();
  await expect(signInButton(page)).toBeVisible();
  await expect(page).toHaveTitle(/Security Patrol Tracker/i);
}

async function submitLogin(page, { email, password }) {
  await gotoLogin(page);
  await emailField(page).fill(email);
  await passwordField(page).fill(password);
  await signInButton(page).click();
}

async function loginAsGuard(page) {
  await submitLogin(page, users.guard);
  await expect(page).toHaveURL(routes.guard);
}

async function loginAsSupervisor(page) {
  await submitLogin(page, users.supervisor);
  await expect(page).toHaveURL(routes.supervisor);
}

async function collectConsoleMessages(page) {
  const messages = [];
  page.on('console', (message) => {
    messages.push({
      type: message.type(),
      text: message.text(),
    });
  });
  page.on('pageerror', (error) => {
    messages.push({
      type: 'pageerror',
      text: error.message,
    });
  });
  return messages;
}

async function validationMessage(locator) {
  return locator.evaluate((input) => input.validationMessage);
}

async function expectTabVisible(page, buttonName, contentText) {
  const tabButton = page.getByRole('button', { name: buttonName });

  await expect(tabButton).toBeVisible();
  await tabButton.click();
  await expect(page.getByText(contentText, { exact: false })).toBeVisible();
}

test.describe('Security Patrol Tracker - Login page structure', () => {
  test('TC-001: login page loads successfully', async ({ page }) => {
    const messages = await collectConsoleMessages(page);

    await gotoLogin(page);

    await expect(page).toHaveURL(routes.login);
    expect(messages.filter((message) => message.type === 'error')).toEqual([]);
  });

  test('TC-002: required login page elements are present', async ({ page }) => {
    await gotoLogin(page);

    await expect(emailField(page)).toBeVisible();
    await expect(passwordField(page)).toBeVisible();
    await expect(signInButton(page)).toBeVisible();
    await expect(page.getByText(/guard/i)).toBeVisible();
    await expect(page.getByText(/supervisor/i)).toBeVisible();
  });
});

test.describe('Security Patrol Tracker - Login validation', () => {
  test('TC-003: empty form submission is blocked by HTML5 validation', async ({
    page,
  }) => {
    await gotoLogin(page);
    await signInButton(page).click();

    await expect(page).toHaveURL(routes.login);
    await expect(emailField(page)).toBeFocused();
    await expect(await validationMessage(emailField(page))).not.toBe('');
  });

  test('TC-004: invalid email format is blocked', async ({ page }) => {
    await gotoLogin(page);
    await emailField(page).fill('invalidemail');
    await passwordField(page).fill('password123');
    await signInButton(page).click();

    await expect(page).toHaveURL(routes.login);
    await expect(emailField(page)).toBeFocused();
    await expect(await validationMessage(emailField(page))).not.toBe('');
  });

  test('TC-005: email field accepts a valid email format', async ({ page }) => {
    await gotoLogin(page);
    await emailField(page).fill(users.guard.email);

    await expect(emailField(page)).toHaveValue(users.guard.email);
    await expect(await validationMessage(emailField(page))).toBe('');
  });

  test('TC-006: password field accepts and masks input', async ({ page }) => {
    await gotoLogin(page);
    await passwordField(page).fill(users.guard.password);

    await expect(passwordField(page)).toHaveValue(users.guard.password);
    await expect(passwordField(page)).toHaveAttribute('type', 'password');
  });
});

test.describe('Security Patrol Tracker - Guard login', () => {
  test('TC-007: guard can login with valid credentials', async ({ page }) => {
    await loginAsGuard(page);
    await expect(page).toHaveTitle(/Security Patrol Tracker/i);
  });

  test('TC-008: guard dashboard is accessible after login', async ({ page }) => {
    await loginAsGuard(page);

    await expect(page).toHaveURL(routes.guard);
    await expect(page.getByText(/guard/i)).toBeVisible();
  });

  test('TC-009: guard can logout', async ({ page }) => {
    await loginAsGuard(page);
    await logoutButton(page).click();

    await expect(page).toHaveURL(routes.login);
    await expect(emailField(page)).toHaveValue('');
    await expect(passwordField(page)).toHaveValue('');
  });
});

test.describe('Security Patrol Tracker - Supervisor dashboard', () => {
  test('TC-010: supervisor can login with valid credentials', async ({
    page,
  }) => {
    await loginAsSupervisor(page);

    await expect(page.getByText(/Welcome,\s*Mike Wilson/i)).toBeVisible();
  });

  test('TC-011: supervisor dashboard layout is visible', async ({ page }) => {
    await loginAsSupervisor(page);

    await expect(page.getByRole('heading', { name: /Supervisor Dashboard/i })).toBeVisible();
    await expect(page.getByText(/Welcome,\s*Mike Wilson/i)).toBeVisible();
    await expect(page.getByText('Active Patrols', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Guards on Duty', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Alerts', { exact: true }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Admin Panel/i })).toBeVisible();
    await expect(logoutButton(page)).toBeVisible();
  });

  test('TC-012: supervisor can open Live Patrols tab', async ({ page }) => {
    await loginAsSupervisor(page);

    await expectTabVisible(page, /Live Patrols/i, /Live Patrols/i);
  });

  test('TC-013: supervisor can open Alerts tab', async ({ page }) => {
    await loginAsSupervisor(page);

    await expectTabVisible(page, /Alerts/i, /No alerts at the moment/i);
  });

  test('TC-014: supervisor can open Guards on Duty tab', async ({ page }) => {
    await loginAsSupervisor(page);

    await expectTabVisible(
      page,
      /Guards on Duty/i,
      /No guards on duty at the moment/i,
    );
  });

  test('TC-015: supervisor can access Admin Panel', async ({ page }) => {
    await loginAsSupervisor(page);
    await page.getByRole('button', { name: /Admin Panel/i }).click();

    await expect(page).toHaveURL(routes.admin);
  });

  test('TC-020: supervisor can logout', async ({ page }) => {
    await loginAsSupervisor(page);
    await logoutButton(page).click();

    await expect(page).toHaveURL(routes.login);
    await expect(emailField(page)).toBeVisible();
  });
});

test.describe('Security Patrol Tracker - Admin Panel', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSupervisor(page);
    await page.getByRole('button', { name: /Admin Panel/i }).click();
    await expect(page).toHaveURL(routes.admin);
  });

  test('TC-016: User Management displays current users', async ({ page }) => {
    await expect(page.getByRole('button', { name: /User Management/i })).toBeVisible();
    await expect(page.getByText(/All Users/i)).toBeVisible();
    await expect(page.getByText(/Mike Wilson/i)).toBeVisible();
    await expect(page.getByText(/Sarah Johnson/i)).toBeVisible();
    await expect(page.getByText(/John Smith/i)).toBeVisible();
    await expect(page.getByText('SUPERVISOR', { exact: true })).toBeVisible();
    await expect(page.getByText('GUARD', { exact: true }).first()).toBeVisible();
  });

  test('TC-017: Create New User form is present', async ({ page }) => {
    await expect(page.getByText(/Create New User/i)).toBeVisible();
    await expect(page.getByPlaceholder(/guard@security\.com/i)).toBeVisible();
    await expect(page.getByPlaceholder(/Minimum 8 characters/i)).toBeVisible();
    await expect(page.getByPlaceholder(/John Doe/i)).toBeVisible();
    await expect(page.getByRole('combobox')).toBeVisible();
  });

  test('TC-018: Site Management tab is accessible', async ({ page }) => {
    await page.getByRole('button', { name: /Site Management/i }).click();

    await expect(page.getByText(/Create New Site/i)).toBeVisible();
    await expect(page.getByText(/All Sites/i)).toBeVisible();
  });

  test('TC-019: Site Management lists existing sites', async ({ page }) => {
    await page.getByRole('button', { name: /Site Management/i }).click();

    await expect(page.getByText(/Downtown Office Complex/i)).toBeVisible();
    await expect(page.getByText(/Checkpoints \(4\)/i)).toBeVisible();
    await expect(page.getByText(/Warehouse District A/i)).toBeVisible();
    await expect(page.getByText(/Checkpoints \(3\)/i)).toBeVisible();
  });
});

test.describe('Security Patrol Tracker - Authentication and errors', () => {
  test('TC-021: supervisor login fails with an invalid password', async ({
    page,
  }) => {
    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes('/auth/login') && response.request().method() === 'POST',
    );

    await submitLogin(page, {
      email: users.supervisor.email,
      password: 'wrongpassword',
    });

    const response = await responsePromise;
    expect(response.status()).toBe(401);
    await expect(page).toHaveURL(routes.login);
  });

  test('TC-022: login fails for a non-existent user', async ({ page }) => {
    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes('/auth/login') && response.request().method() === 'POST',
    );

    await submitLogin(page, {
      email: 'nonexistent@security.com',
      password: 'password123',
    });

    const response = await responsePromise;
    expect(response.status()).toBe(401);
    await expect(page).toHaveURL(routes.login);
  });
});

test.describe('Security Patrol Tracker - Keyboard navigation and accessibility', () => {
  test('TC-023: Tab key moves focus through the login form', async ({ page }) => {
    await gotoLogin(page);

    await emailField(page).focus();
    await page.keyboard.press('Tab');

    await expect(passwordField(page)).toBeFocused();
  });

  test('TC-024: Enter key submits the login form', async ({ page }) => {
    await gotoLogin(page);
    await emailField(page).fill(users.supervisor.email);
    await passwordField(page).fill(users.supervisor.password);
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(routes.supervisor);
  });
});

test.describe('Security Patrol Tracker - Console and network analysis', () => {
  test('TC-025: login page has no critical console errors', async ({ page }) => {
    const messages = await collectConsoleMessages(page);

    await gotoLogin(page);

    expect(
      messages.filter(
        (message) => message.type === 'error' || message.type === 'pageerror',
      ),
    ).toEqual([]);
  });

  test('TC-026: supervisor dashboard has no critical console errors', async ({
    page,
  }) => {
    const messages = await collectConsoleMessages(page);

    await loginAsSupervisor(page);

    const criticalMessages = messages.filter(
      (message) => message.type === 'error' || message.type === 'pageerror',
    );
    const knownWarnings = messages.filter((message) =>
      message.text.includes("{cp.longitude}"),
    );

    expect(criticalMessages).toEqual([]);
    test.info().annotations.push({
      type: 'known-warning-count',
      description: String(knownWarnings.length),
    });
  });

  test('TC-027: active shift backend endpoint is available', async ({
    request,
  }) => {
    const response = await request.get(`${backendUrl}/patrol/active-shift`);
    const status = response.status();

    expect(status, 'Expected /patrol/active-shift not to return 404').not.toBe(404);
    expect(
      response.ok(),
      `Expected /patrol/active-shift to return a 2xx status, received ${status}`,
    ).toBeTruthy();
  });
});

test.describe('Security Patrol Tracker - Session management', () => {
  test('TC-028: session persists while navigating supervisor dashboard tabs', async ({
    page,
  }) => {
    await loginAsSupervisor(page);

    await page.getByRole('button', { name: /Live Patrols/i }).click();
    await expect(page).toHaveURL(routes.supervisor);

    await page.getByRole('button', { name: /Alerts/i }).click();
    await expect(page).toHaveURL(routes.supervisor);

    await page.getByRole('button', { name: /Guards on Duty/i }).click();
    await expect(page).toHaveURL(routes.supervisor);
    await expect(page.getByText(/Welcome,\s*Mike Wilson/i)).toBeVisible();
  });

  test('TC-029: logout terminates supervisor session', async ({ page }) => {
    await loginAsSupervisor(page);
    await logoutButton(page).click();
    await expect(page).toHaveURL(routes.login);

    await page.goto('/supervisor');

    await expect(page).toHaveURL(routes.login);
    await expect(signInButton(page)).toBeVisible();
  });
});
