import { getAllContent } from '@@/server/database/queries/content'
import { contentFiltersSchema } from '@@/shared/validations/content'
import { validateCreatorOrOwner } from '@@/server/utils/teamValidation.ts'

export default defineEventHandler(async (event) => {
  // 1. Get team ID from route parameter
  const teamId = getRouterParam(event, 'id')
  if (!teamId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Team ID is required',
    })
  }

  // 2. Validate user has creator+ access to team
  await validateCreatorOrOwner(event, teamId)

  // 3. Parse and validate query parameters
  const query = getQuery(event)
  const filters = contentFiltersSchema.parse({
    type: query.type,
    tags: query.tags ? (Array.isArray(query.tags) ? query.tags : [query.tags]) : undefined,
    difficulty: query.difficulty,
    is_public: query.is_public === 'true' ? true : query.is_public === 'false' ? false : undefined,
    is_featured: query.is_featured === 'true' ? true : query.is_featured === 'false' ? false : undefined,
    limit: query.limit ? parseInt(query.limit as string) : undefined,
    offset: query.offset ? parseInt(query.offset as string) : undefined,
  })

  // 4. Get content for team
  const content = await getAllContent(teamId, filters)

  return content
})
