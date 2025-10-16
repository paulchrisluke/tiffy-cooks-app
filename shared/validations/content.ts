import { z } from 'zod'

// Base content schema
export const baseContentSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.string().min(10),
  type: z.enum(['recipe', 'lesson', 'post']),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  tags: z.array(z.string()).optional(),
  is_public: z.boolean().optional().default(false),
  is_featured: z.boolean().optional().default(false),
})

// Recipe-specific schema (schema.org Recipe compliance)
export const recipeSchema = baseContentSchema.extend({
  type: z.literal('recipe'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  prep_time: z.number().int().positive().optional(),
  cook_time: z.number().int().positive().optional(),
  servings: z.number().int().positive().optional(),
  ingredients: z.array(z.object({
    name: z.string().min(1),
    amount: z.string().min(1),
    unit: z.string().optional(),
  })).optional(),
  instructions: z.array(z.object({
    step: z.number().int().positive(),
    text: z.string().min(1),
  })).optional(),
})

// Lesson-specific schema
export const lessonSchema = baseContentSchema.extend({
  type: z.literal('lesson'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  prep_time: z.number().int().positive().optional(), // lesson duration
})

// Post-specific schema (general content)
export const postSchema = baseContentSchema.extend({
  type: z.literal('post'),
})

// Union schema for all content types
export const createContentSchema = z.discriminatedUnion('type', [
  recipeSchema,
  lessonSchema,
  postSchema,
])

// Update schema (all fields optional except id)
export const updateContentSchema = createContentSchema.partial().omit({ type: true })

// Query filters schema
export const contentFiltersSchema = z.object({
  type: z.enum(['recipe', 'lesson', 'post']).optional(),
  tags: z.array(z.string()).optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  is_public: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  limit: z.number().int().positive().max(100).optional().default(20),
  offset: z.number().int().min(0).optional().default(0),
})

// Type exports
export type CreateContentInput = z.infer<typeof createContentSchema>
export type UpdateContentInput = z.infer<typeof updateContentSchema>
export type ContentFilters = z.infer<typeof contentFiltersSchema>
export type RecipeInput = z.infer<typeof recipeSchema>
export type LessonInput = z.infer<typeof lessonSchema>
export type PostInput = z.infer<typeof postSchema>
