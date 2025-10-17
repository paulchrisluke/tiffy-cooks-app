import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { sendEmail } from './email'

// Mock the email service
vi.mock('use-email', () => ({
  useEmail: vi.fn(() => ({
    send: vi.fn()
  }))
}))

// Mock the env
vi.mock('@@/env', () => ({
  env: {
    EMAIL_PROVIDER: 'resend',
    FROM_EMAIL: 'test@example.com'
  }
}))

describe('Email Service', () => {
  let originalNodeEnv: string | undefined
  let originalVitest: string | undefined
  let consoleSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.clearAllMocks()
    // Capture original environment values
    originalNodeEnv = process.env.NODE_ENV
    originalVitest = process.env.VITEST
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    // Restore original environment values
    if (originalNodeEnv !== undefined) {
      process.env.NODE_ENV = originalNodeEnv
    } else {
      delete process.env.NODE_ENV
    }

    if (originalVitest !== undefined) {
      process.env.VITEST = originalVitest
    } else {
      delete process.env.VITEST
    }

    // Restore console spy
    consoleSpy.mockRestore()
  })

  it('should log email in test mode instead of sending', async () => {
    // Set test environment
    process.env.NODE_ENV = 'test'

    const emailData = {
      to: 'test@example.com',
      subject: 'Test Email',
      text: 'This is a test email'
    }

    await sendEmail(emailData)

    expect(consoleSpy).toHaveBeenCalledWith('TEST EMAIL:', emailData)
  })

  it('should log email when VITEST is true', async () => {
    // Set VITEST environment
    process.env.VITEST = 'true'
    process.env.NODE_ENV = 'production'

    const emailData = {
      to: 'test@example.com',
      subject: 'Test Email',
      text: 'This is a test email'
    }

    await sendEmail(emailData)

    expect(consoleSpy).toHaveBeenCalledWith('TEST EMAIL:', emailData)
  })
})
