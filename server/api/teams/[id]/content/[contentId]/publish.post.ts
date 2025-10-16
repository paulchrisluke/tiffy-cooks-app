import { publishContent } from '@@/server/database/queries/content'
import { validateCreatorOrOwner } from '@@/server/utils/teamValidation.ts'

export default defineEventHandler(async (event) => {
  // 1. Get team ID and content ID from route parameters
  const teamId = getRouterParam(event, 'id')
  const contentId = getRouterParam(event, 'contentId')

  if (!teamId || !contentId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Team ID and Content ID are required',
    })
  }

  // 2. Validate user has creator+ access to team
  await validateCreatorOrOwner(event, teamId)

  // 3. Publish content
  const content = await publishContent(contentId, teamId)

  return content
})
