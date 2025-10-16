import { createComment } from '@@/server/database/queries/comments'
import { createCommentSchema } from '@@/shared/validations/comments'
import { validateBody } from '@@/server/utils/bodyValidation'
import { requireUserSession } from 'nuxt-auth-utils/server'

export default defineEventHandler(async (event) => {
  // 1. Get content ID from route parameter
  const contentId = getRouterParam(event, 'contentId')
  if (!contentId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Content ID is required',
    })
  }

  // 2. Require user session (auth required for commenting)
  const { user } = await requireUserSession(event)

  // 3. Validate request body
  const data = await validateBody(event, createCommentSchema)

  // 4. Create comment
  const comment = await createComment({
    ...data,
    postId: contentId,
    userId: user.id,
  })

  return comment
})
