import { createEnv } from '@t3-oss/env-nuxt'
import { z } from 'zod'

export const env = createEnv({
  server: {
    MOCK_EMAIL: z
      .string()
      .transform((val) => val === 'true')
      .pipe(z.boolean())
      .optional(),
    BASE_URL: z.string().url().default('http://localhost:3000'),
    APP_NAME: z.string().default('Tiffy App'),
    APP_DESCRIPTION: z.string().default('A modern, feature-rich application built with Nuxt 3 and NuxtHub for seamless development and deployment.'),
    LOGO_URL: z.string().url().default('https://supersaas.dev/logo.png'),
    RESEND_API_TOKEN: z.string().min(1).default('re_test_placeholder_token_for_build'),
    NUXT_OAUTH_GITHUB_CLIENT_ID: z.string().min(1).optional(),
    NUXT_OAUTH_GITHUB_CLIENT_SECRET: z.string().min(1).optional(),
    NUXT_OAUTH_GOOGLE_CLIENT_ID: z.string().min(1).default('placeholder_google_client_id'),
    NUXT_OAUTH_GOOGLE_CLIENT_SECRET: z.string().min(1).default('placeholder_google_client_secret'),
    NUXT_SESSION_PASSWORD: z.string().min(32).default('placeholder_32_char_session_password_here'),
    NUXT_STRIPE_SECRET_KEY: z.string().min(1).default('sk_test_placeholder_stripe_key'),
    NUXT_STRIPE_WEBHOOK_SECRET: z.string().min(1).default('whsec_placeholder_webhook_secret'),
    FROM_EMAIL: z.string().email().default('placeholder@example.com'),
    EMAIL_PROVIDER: z.enum([
      'resend',
      'mailgun',
      'sendgrid',
      'postmark',
      'plunk',
      'zeptomail',
    ]).default('resend'),
    PAYMENT_PROVIDER: z.enum(['stripe', 'lemonsqueezy']).default('stripe'),
    TWILIO_ACCOUNT_SID: z.string().min(1).optional(),
    TWILIO_AUTH_TOKEN: z.string().min(1).optional(),
    TWILIO_PHONE_NUMBER: z
      .string()
      .regex(
        /^\+[1-9]\d{1,14}$/,
        'Phone number must be in E.164 format (e.g. +12125551234)',
      )
      .optional(),
  },
  skipValidation: process.env.NODE_ENV === 'production' && process.env.NUXT_HUB_ENV === 'production',
})
