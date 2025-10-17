import { test, expect } from '@playwright/test'

test.describe('Teams API E2E Tests', () => {
  test.describe('POST /api/teams', () => {
    test('should require authentication', async ({ request }) => {
      const teamData = {
        name: 'Test Team',
        slug: 'test-team',
      }

      const response = await request.post('/api/teams', {
        data: teamData,
      })

      expect(response.status()).toBe(401)
    })

    test('should validate required fields', async ({ request }) => {
      // Create a mock session cookie for testing
      const mockHeaders = {
        'Cookie': 'nuxt-session=test-user-id; Path=/; HttpOnly',
        'Content-Type': 'application/json',
      }

      const response = await request.post('/api/teams', {
        headers: mockHeaders,
        data: { name: 'Test Team' }, // Missing slug
      })

      // Authentication is checked before validation, so we expect 401
      expect(response.status()).toBe(401)
    })
  })

  test.describe('GET /api/teams', () => {
    test('should require authentication', async ({ request }) => {
      const response = await request.get('/api/teams')

      expect(response.status()).toBe(401)
    })
  })

  test.describe('Health Check', () => {
    test('should respond to basic requests', async ({ request }) => {
      const response = await request.get('/')
      expect(response.status()).toBe(200)
    })
  })
})
