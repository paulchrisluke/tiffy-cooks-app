import { test, expect } from '@playwright/test'
import { createTestUser } from '../../fixtures/test-data'

test.describe('User Registration (Unauthenticated)', () => {
  test('should register with valid credentials', async ({ request }) => {
    const userData = createTestUser()

    const response = await request.post('/api/auth/password/register', {
      data: userData,
    })

    expect(response.status()).toBe(201)

    const user = await response.json()
    expect(user).toMatchObject({
      email: userData.email,
      name: userData.name,
      emailVerified: true, // Auto-verified in test mode
    })
    expect(user.id).toBeDefined()
    expect(user.hashedPassword).toBeUndefined() // Should be sanitized
  })

  test('should reject duplicate email', async ({ request }) => {
    const userData = createTestUser()

    // First registration should succeed
    const firstResponse = await request.post('/api/auth/password/register', {
      data: userData,
    })
    expect(firstResponse.status()).toBe(201)

    // Second registration with same email should fail
    const secondResponse = await request.post('/api/auth/password/register', {
      data: userData,
    })
    expect(secondResponse.status()).toBe(400)

    const error = await secondResponse.json()
    expect(error.statusMessage).toContain('already exists')
  })

  test('should validate password requirements', async ({ request }) => {
    const userData = createTestUser()
    userData.password = 'short' // Less than 8 characters

    const response = await request.post('/api/auth/password/register', {
      data: userData,
    })

    expect(response.status()).toBe(400)
  })

  test('should validate email format', async ({ request }) => {
    const userData = createTestUser()
    userData.email = 'invalid-email'

    const response = await request.post('/api/auth/password/register', {
      data: userData,
    })

    expect(response.status()).toBe(400)
  })

  test('should validate required fields', async ({ request }) => {
    const response = await request.post('/api/auth/password/register', {
      data: {
        email: 'test@example.com',
        // Missing name and password
      },
    })

    expect(response.status()).toBe(400)
  })
})
