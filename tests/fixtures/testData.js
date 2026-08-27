/**
 * Test Data - Contains test data and credentials used across test suites
 */

module.exports = {
  // User credentials
  users: {
    supervisor: {
      email: process.env.SUPERVISOR_EMAIL || 'supervisor@security.com',
      password: process.env.SUPERVISOR_PASSWORD || 'password123',
      name: 'Mike Wilson',
    },
    guard: {
      email: process.env.GUARD_EMAIL || 'guard1@security.com',
      password: process.env.GUARD_PASSWORD || 'password123',
    },
  },

  // Invalid credentials for negative tests
  invalidCredentials: {
    invalidEmail: 'invalid@test.com',
    wrongPassword: 'wrongpassword',
    emptyEmail: '',
    emptyPassword: '',
  },

  // Site management test data
  sites: {
    validSite: {
      siteName: 'Test Shopping Center',
      address: '500 Test Avenue, Tech City',
      latitude: 40.7128,
      longitude: -74.006,
    },
    longNameSite: {
      siteName: 'A'.repeat(500), // 500 character site name
      address: '123 Long Street',
      latitude: 40.7128,
      longitude: -74.006,
    },
    specialCharactersSite: {
      siteName: 'Test Site @#$%^&*()',
      address: '456 Special St <script>alert("xss")</script>',
      latitude: 40.7128,
      longitude: -74.006,
    },
    emptySiteName: {
      siteName: '',
      address: '789 Empty St',
      latitude: 40.7128,
      longitude: -74.006,
    },
  },

  // Checkpoint data
  checkpoints: {
    checkpoint1: {
      name: 'Main Entrance',
      latitude: 40.7128,
      longitude: -74.006,
    },
    checkpoint2: {
      name: 'Back Exit',
      latitude: 40.7139,
      longitude: -74.0064,
    },
  },

  // Route patterns for URL matching
  routes: {
    login: /\/login\/?$/,
    guard: /\/guard\/?$/,
    supervisor: /\/supervisor\/?$/,
    admin: /\/admin\/?$/,
    siteManagement: /\/admin\/.*site|\/admin\/?$/,
  },

  // Backend URLs
  backend: {
    baseUrl: process.env.BACKEND_URL || 'https://security-patrol-backend.onrender.com',
    apiEndpoints: {
      login: '/api/auth/login',
      sites: '/api/sites',
      checkpoints: '/api/checkpoints',
      users: '/api/users',
    },
  },

  // Test configuration
  timeouts: {
    short: 5000,
    medium: 10000,
    long: 30000,
    veryLong: 60000,
  },

  // Expected messages and texts
  messages: {
    successCreate: 'created successfully',
    successDelete: 'deleted successfully',
    successCopy: 'QR codes copied to clipboard',
    errorServer: 'Internal server error',
    errorNetwork: 'Network error',
    errorInvalidCredentials: 'Invalid credentials',
  },

  // Existing sites in the system
  existingSites: {
    downtownOfficeComplex: 'Downtown Office Complex',
    warehouseDistrictA: 'Warehouse District A',
  },
};
