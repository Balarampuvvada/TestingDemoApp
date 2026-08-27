/**
 * Test Utilities - Helper functions for common test operations
 */

const { expect } = require('@playwright/test');

/**
 * Wait for element and verify it's visible
 */
async function waitAndVerifyVisible(element, timeout = 5000) {
  try {
    await element.waitFor({ state: 'visible', timeout });
    return true;
  } catch {
    return false;
  }
}

/**
 * Click element after waiting
 */
async function clickWithWait(element, timeout = 5000) {
  await element.waitFor({ state: 'visible', timeout });
  await element.click();
}

/**
 * Fill input after clearing
 */
async function fillWithClear(element, text, timeout = 5000) {
  await element.waitFor({ state: 'visible', timeout });
  await element.fill(text);
}

/**
 * Handle dialog (alert/confirm)
 */
async function handleDialogWithAction(page, acceptDialog, action) {
  return Promise.race([
    page.once('dialog', async (dialog) => {
      if (acceptDialog) {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
    }),
    action(),
  ]);
}

/**
 * Wait for URL change after action
 */
async function waitForURLChange(page, action, newUrlPattern, timeout = 30000) {
  const navigationPromise = page.waitForURL(newUrlPattern, { timeout });
  await action();
  await navigationPromise;
}

/**
 * Take screenshot on failure
 */
async function captureScreenshotOnFailure(page, testName) {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await page.screenshot({
      path: `./test-results/screenshots/${testName}-${timestamp}.png`,
    });
  } catch (error) {
    console.log(`Failed to capture screenshot: ${error.message}`);
  }
}

/**
 * Verify element contains text
 */
async function verifyElementContainsText(element, expectedText, timeout = 5000) {
  try {
    await element.waitFor({ state: 'visible', timeout });
    const text = await element.textContent();
    return text.includes(expectedText);
  } catch {
    return false;
  }
}

/**
 * Get all text content from multiple elements
 */
async function getAllElementsText(elements) {
  const count = await elements.count();
  const texts = [];
  for (let i = 0; i < count; i++) {
    const text = await elements.nth(i).textContent();
    texts.push(text.trim());
  }
  return texts;
}

/**
 * Wait for network idle
 */
async function waitForNetworkIdle(page, timeout = 5000) {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Verify element is focused
 */
async function isElementFocused(element) {
  return await element.evaluate((el) => el === document.activeElement);
}

/**
 * Retry action with exponential backoff
 */
async function retryWithBackoff(action, maxAttempts = 3, baseDelay = 1000) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await action();
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) {
        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.log(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(`Action failed after ${maxAttempts} attempts: ${lastError.message}`);
}

/**
 * Get element attribute value
 */
async function getElementAttribute(element, attributeName) {
  return await element.getAttribute(attributeName);
}

/**
 * Check if element is enabled
 */
async function isElementEnabled(element) {
  try {
    return await element.isEnabled();
  } catch {
    return false;
  }
}

/**
 * Scroll element into view
 */
async function scrollIntoView(element) {
  await element.scrollIntoViewIfNeeded();
}

/**
 * Get element bounding box
 */
async function getElementPosition(element) {
  return await element.boundingBox();
}

/**
 * Compare two values for test assertion
 */
function assertValueMatch(actual, expected, message = '') {
  expect(actual).toBe(expected);
  if (message) {
    console.log(`✅ ${message}`);
  }
}

/**
 * Assert value is truthy
 */
function assertTruthy(value, message = '') {
  expect(value).toBeTruthy();
  if (message) {
    console.log(`✅ ${message}`);
  }
}

/**
 * Assert value is falsy
 */
function assertFalsy(value, message = '') {
  expect(value).toBeFalsy();
  if (message) {
    console.log(`❌ ${message}`);
  }
}

/**
 * Assert text includes substring
 */
function assertTextIncludes(text, substring, message = '') {
  expect(text).toContain(substring);
  if (message) {
    console.log(`✅ ${message}`);
  }
}

/**
 * Log test info
 */
function logTestInfo(testName, details) {
  console.log(`\n📋 Test: ${testName}`);
  if (typeof details === 'object') {
    Object.entries(details).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });
  } else {
    console.log(`   ${details}`);
  }
}

/**
 * Log test warning (issue found)
 */
function logTestWarning(message, severity = 'WARNING') {
  console.log(`⚠️  ${severity}: ${message}`);
}

/**
 * Log test error (critical issue found)
 */
function logTestError(message, severity = 'ERROR') {
  console.log(`❌ ${severity}: ${message}`);
}

/**
 * Log test pass
 */
function logTestPass(message) {
  console.log(`✅ PASS: ${message}`);
}

/**
 * Log test skip
 */
function logTestSkip(message, reason = '') {
  console.log(`⏭️  SKIP: ${message}${reason ? ` - ${reason}` : ''}`);
}

module.exports = {
  // Element interaction utilities
  waitAndVerifyVisible,
  clickWithWait,
  fillWithClear,
  scrollIntoView,

  // Dialog & navigation utilities
  handleDialogWithAction,
  waitForURLChange,
  waitForNetworkIdle,

  // Element state utilities
  verifyElementContainsText,
  isElementFocused,
  isElementEnabled,
  getElementAttribute,
  getElementPosition,

  // Multi-element utilities
  getAllElementsText,

  // Retry utilities
  retryWithBackoff,

  // Screenshot utilities
  captureScreenshotOnFailure,

  // Assertion utilities
  assertValueMatch,
  assertTruthy,
  assertFalsy,
  assertTextIncludes,

  // Logging utilities
  logTestInfo,
  logTestWarning,
  logTestError,
  logTestPass,
  logTestSkip,
};
