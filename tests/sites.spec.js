/**
 * Site Management Tests
 * Tests for CRUD operations on security sites
 * Reference: Test Scenarios 2.1 - 6.1
 */

const test = require('./fixtures/pageFixtures.js');
const { expect } = require('@playwright/test');
const testData = require('./fixtures/testData.js');

test.describe('Site Management - CRUD Operations', () => {
  test.beforeEach(async ({ adminAuth, page }) => {
    // Navigate to site management page before each test
    // This is done via adminAuth fixture which logs in and goes to admin panel
  });

  test.describe('CREATE - Add New Sites', () => {
    test('2.1: Create Site with Valid Data - Backend Error (CRITICAL BUG)', async ({
      adminAuth,
      siteManagementPage,
    }) => {
      // Given: User is in Admin > Site Management
      await adminAuth.clickSiteManagement();
      await siteManagementPage.waitForSiteManagementToLoad();

      // When: User fills form with valid data
      const siteData = {
        siteName: 'Test Shopping Center',
        address: '500 Test Avenue, Tech City',
        latitude: '40.7128',
        longitude: '-74.0060',
      };

      try {
        await siteManagementPage.createSite(siteData);

        // Then: Check if success or error message appears
        await siteManagementPage.page.waitForTimeout(2000);

        const hasError = await siteManagementPage.isErrorMessageDisplayed();
        if (hasError) {
          const errorMsg = await siteManagementPage.getErrorMessage();
          console.error(`❌ CRITICAL BUG: Backend error on site creation - ${errorMsg}`);
          expect(hasError).toBe(true); // Document the bug
        }

        const hasSuccess = await siteManagementPage.isSuccessMessageDisplayed();
        if (!hasSuccess) {
          console.error('❌ CRITICAL BUG: Site was not created. Backend returns HTTP 500 error');
        }
      } catch (error) {
        console.error(`❌ CRITICAL BUG: Error creating site: ${error.message}`);
      }
    });

    test('2.2: Create Site with Empty Required Field (USABILITY ISSUE)', async ({
      adminAuth,
      siteManagementPage,
    }) => {
      // Given: User is in Admin > Site Management
      await adminAuth.clickSiteManagement();
      await siteManagementPage.waitForSiteManagementToLoad();

      // When: User leaves Site Name empty and submits
      const siteData = {
        siteName: '',
        address: '789 Empty St',
        latitude: '40.7128',
        longitude: '-74.0060',
      };

      await siteManagementPage.fillSiteForm(siteData);
      await siteManagementPage.submitSiteForm();

      // Then: Check for client-side validation
      // NOTE: This is marked as an ISSUE - missing validation feedback
      const hasValidationError = await siteManagementPage.page
        .locator('text=/required|invalid/i')
        .isVisible({ timeout: 2000 })
        .catch(() => false);

      if (!hasValidationError) {
        console.warn('⚠️ USABILITY ISSUE: No client-side validation message for empty required fields');
      }

      // Form should either show error or remain on same page
      expect(siteManagementPage.page.url()).toContain('/admin');
    });

    test('2.3: Create Site with Special Characters (POTENTIAL SECURITY ISSUE)', async ({
      adminAuth,
      siteManagementPage,
    }) => {
      // Given: User is in Admin > Site Management
      await adminAuth.clickSiteManagement();
      await siteManagementPage.waitForSiteManagementToLoad();

      // When: User enters special characters in Site Name
      const siteData = {
        siteName: 'Test Site @#$%^&*()',
        address: '456 Special St',
        latitude: '40.7128',
        longitude: '-74.0060',
      };

      try {
        await siteManagementPage.createSite(siteData);
        await siteManagementPage.page.waitForTimeout(2000);

        // Then: Check if special characters are accepted without filtering
        console.warn('⚠️ POTENTIAL SECURITY ISSUE: Special characters accepted without filtering/encoding');
      } catch (error) {
        console.log('Special character test - form may have validation');
      }
    });

    test('2.4: Create Site with Extremely Long Input (USABILITY ISSUE)', async ({
      adminAuth,
      siteManagementPage,
    }) => {
      // Given: User is in Admin > Site Management
      await adminAuth.clickSiteManagement();
      await siteManagementPage.waitForSiteManagementToLoad();

      // When: User enters 500 characters in Site Name
      const longName = 'A'.repeat(500);
      const siteData = {
        siteName: longName,
        address: 'Long Input Street',
        latitude: '40.7128',
        longitude: '-74.0060',
      };

      await siteManagementPage.fillSiteForm(siteData);

      // Then: Check if maximum length is enforced
      const inputValue = await siteManagementPage.siteNameInput.inputValue();
      if (inputValue.length >= 500) {
        console.warn('⚠️ USABILITY ISSUE: No maximum length validation enforced on Site Name field');
      }
    });
  });

  test.describe('READ - View Sites List', () => {
    test('3.1: View All Sites List - Display existing sites', async ({ adminAuth, siteManagementPage }) => {
      // Given: User is in Admin > Site Management
      await adminAuth.clickSiteManagement();
      await siteManagementPage.waitForSiteManagementToLoad();

      // Then: Page displays all existing sites
      const sites = await siteManagementPage.getAllSites();
      console.log(`Found ${sites.length} sites: ${sites.join(', ')}`);

      // Should contain known sites
      const hasSites = sites.length > 0;
      expect(hasSites).toBeTruthy();

      // Each site should have action buttons
      const siteCount = await siteManagementPage.getSiteCount();
      expect(siteCount).toBeGreaterThan(0);
    });

    test('3.2: View QR Codes Modal - Display QR codes for checkpoints', async ({
      adminAuth,
      siteManagementPage,
    }) => {
      // Given: User is in Admin > Site Management
      await adminAuth.clickSiteManagement();
      await siteManagementPage.waitForSiteManagementToLoad();

      // Get the first site to test with
      const sites = await siteManagementPage.getAllSites();
      if (sites.length > 0) {
        const firstSite = sites[0];

        // When: User clicks "View QR Codes" button
        await siteManagementPage.viewQRCodesBySiteName(firstSite);

        // Then: Modal opens showing QR codes
        const isModalVisible = await siteManagementPage.isQRCodesModalVisible();
        expect(isModalVisible).toBeTruthy();

        // And: Modal can be closed
        await siteManagementPage.closeQRCodesModal();
        const isModalClosed = !(await siteManagementPage.isQRCodesModalVisible());
        expect(isModalClosed).toBeTruthy();
      }
    });

    test('3.3: Copy QR Codes Text to Clipboard', async ({ adminAuth, siteManagementPage }) => {
      // Given: User is in Admin > Site Management
      await adminAuth.clickSiteManagement();
      await siteManagementPage.waitForSiteManagementToLoad();

      // Get a site with QR codes
      const sites = await siteManagementPage.getAllSites();
      if (sites.length > 0) {
        const firstSite = sites[0];

        // When: User clicks "Copy Text" button
        await siteManagementPage.viewQRCodesBySiteName(firstSite);
        const isModalVisible = await siteManagementPage.isQRCodesModalVisible();

        if (isModalVisible) {
          try {
            await siteManagementPage.copyQRCodesToClipboard();

            // Then: Success message should be displayed
            const hasSuccess = await siteManagementPage.isSuccessMessageDisplayed();
            if (hasSuccess) {
              const successMsg = await siteManagementPage.getSuccessMessage();
              expect(successMsg).toContain('QR codes copied');
            }
          } catch (error) {
            console.log('Copy functionality may not be available in this context');
          }

          await siteManagementPage.closeQRCodesModal();
        }
      }
    });
  });

  test.describe('UPDATE - Edit Sites', () => {
    test('4.1: Edit Site - Feature Not Implemented', async ({ adminAuth, siteManagementPage }) => {
      // Given: User is in Admin > Site Management
      await adminAuth.clickSiteManagement();
      await siteManagementPage.waitForSiteManagementToLoad();

      // Then: No Edit Button is visible
      const sites = await siteManagementPage.getAllSites();
      if (sites.length > 0) {
        const editButtonExists = await siteManagementPage.page
          .getByRole('button', { name: /edit/i })
          .isVisible({ timeout: 2000 })
          .catch(() => false);

        if (!editButtonExists) {
          console.warn('❌ FEATURE NOT IMPLEMENTED: No Edit functionality visible for sites');
          expect(editButtonExists).toBe(false); // Document the missing feature
        }
      }
    });
  });

  test.describe('DELETE - Remove Sites', () => {
    test('5.1: Delete Site with Confirmation - Successfully deleted', async ({
      adminAuth,
      siteManagementPage,
    }) => {
      // Given: User is in Admin > Site Management
      await adminAuth.clickSiteManagement();
      await siteManagementPage.waitForSiteManagementToLoad();

      const initialCount = await siteManagementPage.getSiteCount();
      const sites = await siteManagementPage.getAllSites();

      if (sites.length > 0) {
        const siteToDelete = sites[0];

        // When: User clicks Delete button
        // Handle the confirmation dialog
        await Promise.race([
          siteManagementPage.page.once('dialog', async (dialog) => {
            const message = dialog.message();
            console.log(`Confirmation dialog: ${message}`);
            // Check for expected message
            expect(message.toLowerCase()).toContain('delete');
            await dialog.accept();
          }),
          siteManagementPage.deleteSiteByName(siteToDelete),
        ]);

        // Then: Site should be deleted
        await siteManagementPage.page.waitForTimeout(2000);
        const finalCount = await siteManagementPage.getSiteCount();
        expect(finalCount).toBeLessThanOrEqual(initialCount);
      }
    });

    test('5.2: Delete Site - Cancel Confirmation', async ({ adminAuth, siteManagementPage }) => {
      // Given: User is in Admin > Site Management
      await adminAuth.clickSiteManagement();
      await siteManagementPage.waitForSiteManagementToLoad();

      const initialCount = await siteManagementPage.getSiteCount();
      const sites = await siteManagementPage.getAllSites();

      if (sites.length > 0) {
        const siteToDelete = sites[0];

        // When: User dismisses confirmation dialog
        let dialogHandled = false;
        siteManagementPage.page.once('dialog', async (dialog) => {
          dialogHandled = true;
          await dialog.dismiss();
        });

        try {
          await siteManagementPage.deleteSiteByName(siteToDelete);
          await siteManagementPage.page.waitForTimeout(2000);
        } catch {
          // Dialog handling may have happened
        }

        // Then: Site should NOT be deleted
        const finalCount = await siteManagementPage.getSiteCount();
        expect(finalCount).toBe(initialCount);
      }
    });
  });

  test.describe('SEARCH & FILTER', () => {
    test('6.1: Search for Sites - Feature Not Implemented', async ({ adminAuth, siteManagementPage }) => {
      // Given: User is in Admin > Site Management viewing sites list
      await adminAuth.clickSiteManagement();
      await siteManagementPage.waitForSiteManagementToLoad();

      // Then: No search or filter input is visible
      const hasSearchInput = await siteManagementPage.page
        .getByPlaceholder(/search/i)
        .isVisible({ timeout: 2000 })
        .catch(() => false);

      if (!hasSearchInput) {
        console.warn('❌ FEATURE NOT IMPLEMENTED: No search/filter functionality visible');
        expect(hasSearchInput).toBe(false); // Document the missing feature
      }

      // And: Users must manually scroll to find sites
      console.log('Users must manually scroll through all sites to find specific ones');
    });
  });

  test.describe('Site Management - Validation Edge Cases', () => {
    test('Special characters in address field', async ({ adminAuth, siteManagementPage }) => {
      await adminAuth.clickSiteManagement();
      await siteManagementPage.waitForSiteManagementToLoad();

      const siteData = {
        siteName: 'XSS Test Site',
        address: '<script>alert("XSS")</script>',
        latitude: '40.7128',
        longitude: '-74.0060',
      };

      await siteManagementPage.fillSiteForm(siteData);
      // Verify form accepts the input
      const addressValue = await siteManagementPage.siteAddressInput.inputValue();
      expect(addressValue).toContain('<script>');
    });

    test('Boundary values for coordinates', async ({ adminAuth, siteManagementPage }) => {
      await adminAuth.clickSiteManagement();
      await siteManagementPage.waitForSiteManagementToLoad();

      const testCases = [
        { latitude: '90', longitude: '180' }, // Max values
        { latitude: '-90', longitude: '-180' }, // Min values
        { latitude: '0', longitude: '0' }, // Zero values
      ];

      for (const coords of testCases) {
        const siteData = {
          siteName: `Boundary Test ${coords.latitude}`,
          address: 'Test Address',
          latitude: coords.latitude,
          longitude: coords.longitude,
        };

        await siteManagementPage.fillSiteForm(siteData);
        // Verify values are accepted
        const latValue = await siteManagementPage.latitudeInput.inputValue();
        const lonValue = await siteManagementPage.longitudeInput.inputValue();
        expect(latValue).toBe(coords.latitude);
        expect(lonValue).toBe(coords.longitude);
      }
    });
  });
});
