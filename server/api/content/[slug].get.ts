import { getContentBySlug } from '@@/server/database/queries/content'

export default defineEventHandler(async (event) => {
  // 1. Get slug from route parameter
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug is required',
    })
  }

  // 2. Get content by slug (public only)
  const content = await getContentBySlug(slug)

  return content
})
