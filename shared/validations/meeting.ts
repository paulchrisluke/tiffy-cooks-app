import { z } from 'zod'

export const meetingRequestSchema = z.object({
  message: z.string().min(10, 'Please provide at least 10 characters').max(1000, 'Message is too long'),
})
