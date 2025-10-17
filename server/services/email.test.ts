import { describe, it, expect, vi, beforeEach } from 'vitest'
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
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should log email in test mode instead of sending', async () => {
    // Set test environment
    process.env.NODE_ENV = 'test'
    
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    
    const emailData = {
      to: 'test@example.com',
      subject: 'Test Email',
      text: 'This is a test email'
    }

    await sendEmail(emailData)

    expect(consoleSpy).toHaveBeenCalledWith('TEST EMAIL:', emailData)
    
    consoleSpy.mockRestore()
  })

  it('should log email when VITEST is true', async () => {
    // Set VITEST environment
    process.env.VITEST = 'true'
    process.env.NODE_ENV = 'production'
    
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    
    const emailData = {
      to: 'test@example.com',
      subject: 'Test Email',
      text: 'This is a test email'
    }

    await sendEmail(emailData)

    expect(consoleSpy).toHaveBeenCalledWith('TEST EMAIL:', emailData)
    
    consoleSpy.mockRestore()
  })
})
