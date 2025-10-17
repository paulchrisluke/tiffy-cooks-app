/**
 * Authentication helper functions for E2E tests
 */

import type { APIRequestContext, APIResponse } from '@playwright/test'
import { createTestUser } from './test-data'

export interface TestUser {
  email: string
  password: string
  name: string
}

/**
 * Validates a login response by checking HTTP status and session cookie
 */
async function validateLoginResponse(loginResponse: APIResponse): Promise<void> {
  // Validate HTTP status is successful (2xx)
  if (!loginResponse.ok()) {
    const body = await loginResponse.text()
    throw new Error(`User login failed with status ${loginResponse.status()}: ${body}`)
  }

  // Verify that a session cookie was set (indicates successful authentication)
  const setCookieHeader = loginResponse.headers()['set-cookie']

  if (!setCookieHeader) {
    throw new Error('Login succeeded but no session cookie was set - authentication may have failed')
  }

  // Split cookie header string into array and check for session cookie
  const cookies = setCookieHeader.split(/\r?\n/).map(cookie => cookie.trim())
  const hasSessionCookie = cookies.some(cookie => cookie.startsWith('nuxt-session='))

  if (!hasSessionCookie) {
    throw new Error('Login succeeded but no session cookie was set - authentication may have failed')
  }
}

export async function createAuthenticatedUser(
  request: APIRequestContext,
  userData?: TestUser
): Promise<TestUser> {
  const user = userData || createTestUser()

  // Register user (auto-verified in test mode)
  const registerResponse = await request.post('/api/auth/password/register', {
    data: user
  })

  if (!registerResponse.ok()) {
    const body = await registerResponse.text()
    throw new Error(`User registration failed with status ${registerResponse.status()}: ${body}`)
  }

  // Login to establish session
  const loginResponse = await request.post('/api/auth/password/login', {
    data: { email: user.email, password: user.password }
  })

  await validateLoginResponse(loginResponse)

  return user
}

export async function loadTestUser(): Promise<TestUser> {
  try {
    const fs = await import('fs')
    const path = await import('path')
    const testUserPath = path.join(process.cwd(), 'tests/fixtures/test-user.json')
    const data = fs.readFileSync(testUserPath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    throw new Error('Test user not found. Run global setup first.', { cause: error })
  }
}

export async function loginUser(
  request: APIRequestContext,
  user: TestUser
): Promise<void> {
  const loginResponse = await request.post('/api/auth/password/login', {
    data: { email: user.email, password: user.password }
  })

  await validateLoginResponse(loginResponse)
}
