/**
 * Test data factories for E2E tests
 * Uses timestamps and unique identifiers to avoid conflicts
 */

const generateUniqueId = (prefix = 'test') => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1e6)
  return `${prefix}-${timestamp}-${random}`
}

export const createTestUser = (suffix?: string) => {
  const generatedId = suffix || generateUniqueId('user')
  return {
    email: `test-${generatedId}@example.com`,
    password: 'TestPassword123!',
    name: `Test User ${generatedId}`
  }
}

export const createTestTeam = (suffix?: string) => {
  const uniqueId = suffix || generateUniqueId('team')
  return {
    name: `Test Team ${uniqueId}`,
    slug: `test-team-${uniqueId}`,
    logo: null
  }
}

// Default test user for global setup
export const testUser = createTestUser('global')

// Default test team for authenticated tests
export const testTeam = createTestTeam('global')
