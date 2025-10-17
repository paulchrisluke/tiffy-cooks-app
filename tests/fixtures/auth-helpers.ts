/**
 * Authentication helper functions for E2E tests
 */

import type { APIRequestContext } from '@playwright/test'
import { createTestUser } from './test-data'

export interface TestUser {
  email: string
  password: string
  name: string
}

export async function createAuthenticatedUser(
  request: APIRequestContext,
  userData?: TestUser
): Promise<TestUser> {
  const user = userData || createTestUser()

  // Register user (auto-verified in test mode)
  await request.post('/api/auth/password/register', {
    data: user
  })

  // Login to establish session
  await request.post('/api/auth/password/login', {
    data: { email: user.email, password: user.password }
  })

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
    throw new Error('Test user not found. Run global setup first.')
  }
}

export async function loginUser(
  request: APIRequestContext,
  user: TestUser
): Promise<void> {
  await request.post('/api/auth/password/login', {
    data: { email: user.email, password: user.password }
  })
}
