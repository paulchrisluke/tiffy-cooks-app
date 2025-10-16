import { getPublicContent, getFeaturedContent } from '@@/server/database/queries/content'
import { contentFiltersSchema } from '@@/shared/validations/content'

export default defineEventHandler(async (event) => {
  // 1. Parse and validate query parameters
  const query = getQuery(event)
  const filters = contentFiltersSchema.parse({
    type: query.type,
    tags: query.tags ? (Array.isArray(query.tags) ? query.tags : [query.tags]) : undefined,
    difficulty: query.difficulty,
    is_featured: query.is_featured === 'true' ? true : query.is_featured === 'false' ? false : undefined,
    limit: query.limit ? parseInt(query.limit as string) : undefined,
    offset: query.offset ? parseInt(query.offset as string) : undefined,
  })

  // 2. If featured is requested, return featured content
  if (filters.is_featured) {
    const featuredContent = await getFeaturedContent(filters.limit || 10)
    return featuredContent
  }

  // 3. Get public content
  const content = await getPublicContent(filters)

  return content
})
