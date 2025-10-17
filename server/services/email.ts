import { useEmail } from 'use-email'
import { createError } from 'h3'
import { env } from '@@/env'

const EMAIL_PROVIDER = env.EMAIL_PROVIDER
const emailService = useEmail(EMAIL_PROVIDER)

// Test double for email service - stores sent emails without logging PII
let testEmailStore: Array<{ to: string | string[], subject: string, text?: string, html?: string }> = []

export interface BaseEmailPayload {
  to: string | string[]
  subject: string
}

export interface TextEmailPayload extends BaseEmailPayload {
  text: string
  html?: string
}

export interface HtmlEmailPayload extends BaseEmailPayload {
  text?: string
  html: string
}

export type EmailPayload = TextEmailPayload | HtmlEmailPayload

export async function sendEmail({ to, subject, text, html }: EmailPayload) {
  try {
    // In test mode, store email data without logging PII
    if (process.env.NODE_ENV === 'test' || process.env.VITEST === 'true') {
      testEmailStore.push({ to, subject, text, html })
      return
    }

    // Use real email service in non-test mode
    await emailService.send({
      from: env.FROM_EMAIL,
      to,
      subject,
      text,
      html,
    })
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to send email',
    })
  }
}

// Test utilities for email service
export function getTestEmails() {
  return [...testEmailStore]
}

export function clearTestEmails() {
  testEmailStore = []
}

export function getTestEmailCount() {
  return testEmailStore.length
}
