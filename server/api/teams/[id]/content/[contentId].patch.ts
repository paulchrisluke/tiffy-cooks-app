import { updateContent } from '@@/server/database/queries/content'
import { updateContentSchema } from '@@/shared/validations/content'
import { validateBody } from '@@/server/utils/bodyValidation'
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
  const { user } = await validateCreatorOrOwner(event, teamId)

  // 3. Validate request body
  const data = await validateBody(event, updateContentSchema)

  // 4. Update content
  const content = await updateContent(contentId, teamId, user.id, data)

  return content
})
