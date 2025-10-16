import { z } from 'zod'

// Create comment schema
export const createCommentSchema = z.object({
  postId: z.string().min(1),
  content: z.string().min(1).max(2000),
  parentId: z.string().optional(), // for nested replies
})

// Update comment schema
export const updateCommentSchema = z.object({
  content: z.string().min(1).max(2000),
})

// Comment filters schema
export const commentFiltersSchema = z.object({
  includeUnapproved: z.boolean().optional().default(false),
  limit: z.number().int().positive().max(100).optional().default(20),
  offset: z.number().int().min(0).optional().default(0),
})

// Moderation actions schema
export const moderateCommentSchema = z.object({
  action: z.enum(['approve', 'flag', 'delete']),
  reason: z.string().optional(),
})

// Type exports
export type CreateCommentInput = z.infer<typeof createCommentSchema>
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>
export type CommentFilters = z.infer<typeof commentFiltersSchema>
export type ModerateCommentInput = z.infer<typeof moderateCommentSchema>
