import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { sendEmail, getTestEmails, clearTestEmails, getTestEmailCount } from './email'

// Create a shared mock function using vi.hoisted
const mockSend = vi.hoisted(() => vi.fn())

// Mock the email service
vi.mock('use-email', () => ({
  useEmail: vi.fn(() => ({ send: mockSend }))
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

  beforeEach(() => {
    vi.clearAllMocks()
    clearTestEmails()
    // Capture original environment values
    originalNodeEnv = process.env.NODE_ENV
    originalVitest = process.env.VITEST
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
  })

  it('should store email in test mode instead of sending', async () => {
    // Set test environment
    process.env.NODE_ENV = 'test'

    const emailData = {
      to: 'test@example.com',
      subject: 'Test Email',
      text: 'This is a test email'
    }

    await sendEmail(emailData)

    const storedEmails = getTestEmails()
    expect(storedEmails).toHaveLength(1)
    expect(storedEmails[0]).toEqual(emailData)
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('should store email when VITEST is true', async () => {
    // Set VITEST environment
    process.env.VITEST = 'true'
    process.env.NODE_ENV = 'production'

    const emailData = {
      to: 'test@example.com',
      subject: 'Test Email',
      text: 'This is a test email'
    }

    await sendEmail(emailData)

    const storedEmails = getTestEmails()
    expect(storedEmails).toHaveLength(1)
    expect(storedEmails[0]).toEqual(emailData)
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('should call email service send method in production mode', async () => {
    // Set production environment (not test mode)
    process.env.NODE_ENV = 'production'
    delete process.env.VITEST

    // Make the mock resolve successfully
    mockSend.mockResolvedValue(undefined)

    const emailData = {
      to: 'test@example.com',
      subject: 'Test Email',
      text: 'This is a test email'
    }

    await sendEmail(emailData)

    expect(mockSend).toHaveBeenCalledWith({
      from: 'test@example.com',
      to: 'test@example.com',
      subject: 'Test Email',
      text: 'This is a test email',
      html: undefined
    })
    expect(getTestEmailCount()).toBe(0)
  })

  it('should handle multiple emails in test mode', async () => {
    process.env.NODE_ENV = 'test'

    const email1 = {
      to: 'user1@example.com',
      subject: 'Email 1',
      text: 'First email'
    }

    const email2 = {
      to: 'user2@example.com',
      subject: 'Email 2',
      html: '<p>Second email</p>'
    }

    await sendEmail(email1)
    await sendEmail(email2)

    const storedEmails = getTestEmails()
    expect(storedEmails).toHaveLength(2)
    expect(storedEmails[0]).toEqual(email1)
    expect(storedEmails[1]).toEqual(email2)
    expect(getTestEmailCount()).toBe(2)
  })

  it('should clear test emails', async () => {
    process.env.NODE_ENV = 'test'

    const emailData = {
      to: 'test@example.com',
      subject: 'Test Email',
      text: 'This is a test email'
    }

    await sendEmail(emailData)
    expect(getTestEmailCount()).toBe(1)

    clearTestEmails()
    expect(getTestEmailCount()).toBe(0)
    expect(getTestEmails()).toHaveLength(0)
  })

  it('should handle HTML emails in test mode', async () => {
    process.env.NODE_ENV = 'test'

    const emailData = {
      to: 'test@example.com',
      subject: 'HTML Email',
      html: '<h1>Hello</h1><p>This is HTML content</p>'
    }

    await sendEmail(emailData)

    const storedEmails = getTestEmails()
    expect(storedEmails).toHaveLength(1)
    expect(storedEmails[0]).toEqual(emailData)
  })

  it('should handle multiple recipients in test mode', async () => {
    process.env.NODE_ENV = 'test'

    const emailData = {
      to: ['user1@example.com', 'user2@example.com'],
      subject: 'Multiple Recipients',
      text: 'Email to multiple people'
    }

    await sendEmail(emailData)

    const storedEmails = getTestEmails()
    expect(storedEmails).toHaveLength(1)
    expect(storedEmails[0]).toEqual(emailData)
  })
})
