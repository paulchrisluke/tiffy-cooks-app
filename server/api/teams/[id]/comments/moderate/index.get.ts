import { getUnapprovedComments } from '@@/server/database/queries/comments'
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

  // 3. Parse query parameters
  const query = getQuery(event)
  const limit = query.limit ? parseInt(query.limit as string) : 50

  // 4. Get unapproved comments for moderation
  const comments = await getUnapprovedComments(teamId, limit)

  return comments
})
