import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false, // Run sequentially for database isolation
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Single worker to avoid DB conflicts
  reporter: process.env.CI ? [['html', { open: 'never' }]] : [['list']],

  globalSetup: './tests/e2e/setup/global-setup.ts',

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:8787',
    trace: 'on-first-retry',
  },

  // Start Wrangler dev server before tests
  webServer: {
    command: 'pnpm run build && npx wrangler dev --port 8787 --local --persist-to .wrangler/state',
    url: 'http://127.0.0.1:8787',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000, // 2 minutes for build + startup
    env: {
      NODE_ENV: 'test',
      MOCK_EMAIL: 'true',
      NUXT_SESSION_COOKIE_SECURE: 'false',
      NUXT_SESSION_COOKIE_SAME_SITE: 'lax',
    },
  },

  projects: [
    // Authenticated tests (default)
    {
      name: 'authenticated',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'tests/fixtures/auth.json',
      },
      testMatch: /.*\.auth\.test\.ts/,
    },
    // Unauthenticated tests
    {
      name: 'unauthenticated',
      use: {
        ...devices['Desktop Chrome'],
        storageState: undefined, // No auth state
      },
      testMatch: /.*\.unauth\.test\.ts/,
    },
  ],
})
