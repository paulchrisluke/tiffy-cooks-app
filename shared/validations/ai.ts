import { z } from 'zod'

// AI request schema
export const aiRequestSchema = z.object({
  prompt: z.string().min(1).max(2000),
  postId: z.string().optional(), // context recipe
  sessionId: z.string().optional(), // for anonymous users
  model: z.enum(['gpt-4', 'gpt-3.5-turbo']).optional().default('gpt-4'),
})

// AI response schema
export const aiResponseSchema = z.object({
  response: z.string(),
  model: z.string(),
  tokensUsed: z.number().optional(),
  suggestions: z.array(z.string()).optional(), // recipe suggestions
})

// AI interaction filters schema
export const aiInteractionFiltersSchema = z.object({
  userId: z.string().optional(),
  postId: z.string().optional(),
  timeframe: z.enum(['day', 'week', 'month']).optional().default('day'),
  limit: z.number().int().positive().max(100).optional().default(20),
  offset: z.number().int().min(0).optional().default(0),
})

// Type exports
export type AIRequestInput = z.infer<typeof aiRequestSchema>
export type AIResponse = z.infer<typeof aiResponseSchema>
export type AIInteractionFilters = z.infer<typeof aiInteractionFiltersSchema>
