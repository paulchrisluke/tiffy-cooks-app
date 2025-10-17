/**
 * Global setup for Playwright tests
 * Creates a shared authenticated user for all tests
 */

import { chromium, FullConfig } from '@playwright/test'
import { testUser } from '../../fixtures/test-data'
import fs from 'fs'
import path from 'path'

export default async function globalSetup(config: FullConfig) {
  // Safely extract baseURL with proper validation
  if (!config.projects || config.projects.length === 0) {
    throw new Error('Playwright config must have at least one project defined')
  }

  const firstProject = config.projects[0]
  if (!firstProject.use?.baseURL) {
    throw new Error('Playwright config project must have baseURL defined in use configuration')
  }

  const baseURL = firstProject.use.baseURL
  const browser = await chromium.launch()
  const context = await browser.newContext({
    baseURL,
    // Ensure cookies work with the exact same origin
    ignoreHTTPSErrors: true,
  })
  const page = await context.newPage()

  try {
    // Register test user (auto-verified in test mode)
    const registerResponse = await page.request.post('/api/auth/password/register', {
      data: testUser
    })

    if (registerResponse.status() !== 201) {
      // If user already exists, that's okay - we can still try to login
      if (registerResponse.status() !== 400) {
        const errorText = await registerResponse.text()
        throw new Error(`Registration failed: ${registerResponse.status()} - ${errorText}`)
      }
    }

    // Login to capture session
    const loginResponse = await page.request.post('/api/auth/password/login', {
      data: { email: testUser.email, password: testUser.password }
    })

    if (loginResponse.status() !== 204) {
      const errorText = await loginResponse.text()
      throw new Error(`Login failed: ${loginResponse.status()} - ${errorText}`)
    }

    // Ensure directory exists before writing files
    const fixturesDir = path.join(process.cwd(), 'tests/fixtures')
    await fs.promises.mkdir(fixturesDir, { recursive: true })

    // Save auth state for authenticated tests
    const authPath = path.join(process.cwd(), 'tests/fixtures/auth.json')
    await context.storageState({ path: authPath })

    // Save test user data for reference
    const testUserPath = path.join(process.cwd(), 'tests/fixtures/test-user.json')
    await fs.promises.writeFile(testUserPath, JSON.stringify(testUser, null, 2))

  } catch (error) {
    throw error
  } finally {
    await browser.close()
  }
}
