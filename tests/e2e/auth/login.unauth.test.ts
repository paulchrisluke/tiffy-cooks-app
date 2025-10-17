import { test, expect } from '@playwright/test'
import { createTestUser } from '../../fixtures/test-data'

test.describe('User Login (Unauthenticated)', () => {
  test('should login with valid credentials', async ({ request }) => {
    const userData = createTestUser()

    // Register user first
    await request.post('/api/auth/password/register', {
      data: userData
    })

    // Login should succeed
    const response = await request.post('/api/auth/password/login', {
      data: {
        email: userData.email,
        password: userData.password
      }
    })

    expect(response.status()).toBe(204) // No content on successful login
  })

  test('should reject invalid password', async ({ request }) => {
    const userData = createTestUser()

    // Register user first
    await request.post('/api/auth/password/register', {
      data: userData
    })

    // Login with wrong password should fail
    const response = await request.post('/api/auth/password/login', {
      data: {
        email: userData.email,
        password: 'wrongpassword'
      }
    })

    expect(response.status()).toBe(400)

    const error = await response.json()
    expect(error.statusMessage).toContain('Invalid password')
  })

  test('should reject non-existent user', async ({ request }) => {
    const response = await request.post('/api/auth/password/login', {
      data: {
        email: 'nonexistent@example.com',
        password: 'somepassword'
      }
    })

    expect(response.status()).toBe(400)

    const error = await response.json()
    expect(error.statusMessage).toContain('User not found')
  })

  test('should validate login schema', async ({ request }) => {
    const response = await request.post('/api/auth/password/login', {
      data: {
        email: 'test@example.com'
        // Missing password
      }
    })

    expect(response.status()).toBe(400)
  })

  test('should reject unverified email', async ({ request }) => {
    // This test would require a user that's not auto-verified
    // In our current setup, all users are auto-verified in test mode
    // This test documents the expected behavior for production
    test.skip(true, 'Auto-verification enabled in test mode')
  })
})
