import { deleteComment } from '@@/server/database/queries/comments'
import { requireUserSession } from 'nuxt-auth-utils/server'

export default defineEventHandler(async (event) => {
  // 1. Get content ID and comment ID from route parameters
  const contentId = getRouterParam(event, 'contentId')
  const commentId = getRouterParam(event, 'commentId')

  if (!contentId || !commentId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Content ID and Comment ID are required',
    })
  }

  // 2. Require user session
  const { user } = await requireUserSession(event)

  // 3. Delete comment (only if user owns it)
  const comment = await deleteComment(commentId, user.id)

  return comment
})
