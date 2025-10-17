import { z } from 'zod'
import { insertTeamSchema } from '@@/types/database'
import { UserRole } from '@@/constants'

export const createTeamSchema = z.object({
  name: z.string().min(1, 'Team name is required'),
  logo: z.string().nullable().optional(),
  slug: z.string()
    .min(3, 'Slug must be at least 3 characters')
    .max(50, 'Slug must be less than 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .refine((slug) => !slug.startsWith('-') && !slug.endsWith('-'),
      'Slug cannot start or end with a hyphen')
    .transform((s) => s.trim().toLowerCase())  // Normalize after validation
})

export const updateTeamSchema = z.object({
  name: z.string().min(1, 'Team name cannot be empty').optional(),
  logo: z.string().nullable().optional(),
}).partial()

export const inviteTeamMemberSchema = z.object({
  email: z.string().email(),
  role: z
    .enum([UserRole.MEMBER, UserRole.ADMIN, UserRole.OWNER])
    .default(UserRole.MEMBER),
})
