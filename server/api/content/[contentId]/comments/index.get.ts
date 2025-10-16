import { getCommentsByPostId } from '@@/server/database/queries/comments'
import { commentFiltersSchema } from '@@/shared/validations/comments'

export default defineEventHandler(async (event) => {
  // 1. Get content ID from route parameter
  const contentId = getRouterParam(event, 'contentId')
  if (!contentId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Content ID is required',
    })
  }

  // 2. Parse and validate query parameters
  const query = getQuery(event)
  const filters = commentFiltersSchema.parse({
    includeUnapproved: query.includeUnapproved === 'true',
    limit: query.limit ? parseInt(query.limit as string) : undefined,
    offset: query.offset ? parseInt(query.offset as string) : undefined,
  })

  // 3. Get comments for content (public endpoint - only approved comments by default)
  const comments = await getCommentsByPostId(contentId, filters)

  return comments
})
