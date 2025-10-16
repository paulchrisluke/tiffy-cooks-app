import { createContent } from '@@/server/database/queries/content'
import { createContentSchema } from '@@/shared/validations/content'
import { validateBody } from '@@/server/utils/bodyValidation'
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
  const { user } = await validateCreatorOrOwner(event, teamId)

  // 3. Validate request body
  const data = await validateBody(event, createContentSchema)

  // 4. Create content
  const content = await createContent({
    ...data,
    userId: user.id,
    teamId,
  })

  return content
})
