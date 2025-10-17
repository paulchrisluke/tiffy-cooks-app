import { test, expect } from '@playwright/test'
import { createTestUser } from '../../fixtures/test-data'

test.describe('User Login (Unauthenticated)', () => {
  test('should login with valid credentials', async ({ request }) => {
    const userData = createTestUser()

    // Register user first
    const registerResponse = await request.post('/api/auth/password/register', {
      data: userData
    })

    // Assert registration succeeded
    expect(registerResponse.status()).toBe(201) // Created status on successful registration

    // Parse registration response to ensure user was created
    const registeredUser = await registerResponse.json()
    expect(registeredUser).toHaveProperty('id')
    expect(registeredUser.email).toBe(userData.email)

    // Login should succeed
    const loginResponse = await request.post('/api/auth/password/login', {
      data: {
        email: userData.email,
        password: userData.password
      }
    })

    // Assert login response status
    expect(loginResponse.status()).toBe(204) // No content on successful login

    // Verify that authentication was established by checking for session cookie
    const cookies = loginResponse.headers()['set-cookie']
    const cookieArray = Array.isArray(cookies) ? cookies : cookies ? [cookies] : []
    const hasSessionCookie = cookieArray.some(cookie =>
      cookie.includes('nuxt-session') || cookie.includes('session')
    )

    expect(hasSessionCookie).toBe(true) // Authentication should be established
  })

  test('should reject invalid password', async ({ request }) => {
    const userData = createTestUser()

    // Register user first
    const registerResponse = await request.post('/api/auth/password/register', {
      data: userData
    })

    // Assert registration succeeded
    expect(registerResponse.status()).toBe(201)

    // Parse registration response to ensure user was created
    const registeredUser = await registerResponse.json()
    expect(registeredUser).toHaveProperty('id')
    expect(registeredUser.email).toBe(userData.email)

    // Login with wrong password should fail
    const response = await request.post('/api/auth/password/login', {
      data: {
        email: userData.email,
        password: 'wrongpassword'
      }
    })

    expect(response.status()).toBe(400)

    const error = await response.json()
    expect(error.message).toContain('Invalid password')
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
    expect(error.message).toContain('User not found')
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
