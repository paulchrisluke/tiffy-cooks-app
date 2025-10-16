import { flagComment } from '@@/server/database/queries/comments'
import { validateCreatorOrOwner } from '@@/server/utils/teamValidation.ts'

export default defineEventHandler(async (event) => {
  // 1. Get team ID and comment ID from route parameters
  const teamId = getRouterParam(event, 'id')
  const commentId = getRouterParam(event, 'commentId')

  if (!teamId || !commentId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Team ID and Comment ID are required',
    })
  }

  // 2. Validate user has creator+ access to team
  await validateCreatorOrOwner(event, teamId)

  // 3. Flag comment
  const comment = await flagComment(commentId)

  return comment
})
