import { and, eq, desc, asc, sql } from 'drizzle-orm'
import { tables } from '@@/server/database/schema'
import type { CreateCommentInput, CommentFilters } from '@@/shared/validations/comments'

export const getCommentsByPostId = async (postId: string, filters: CommentFilters = {}) => {
  try {
    const conditions = [eq(tables.comments.postId, postId)]

    // Only show approved comments unless specifically requested
    if (!filters.includeUnapproved) {
      conditions.push(eq(tables.comments.isApproved, true))
    }

    const comments = await useDB().query.comments.findMany({
      where: and(...conditions),
      orderBy: [asc(tables.comments.createdAt)],
      limit: filters.limit || 20,
      offset: filters.offset || 0,
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        parent: {
          columns: {
            id: true,
            content: true,
            createdAt: true,
          },
          with: {
            user: {
              columns: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    })

    return comments
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get comments by post ID',
    })
  }
}

export const createComment = async (data: CreateCommentInput & { userId: string }) => {
  try {
    const newComment = await useDB()
      .insert(tables.comments)
      .values({
        ...data,
        isApproved: false, // Default to unapproved for moderation
      })
      .returning()
      .get()

    return newComment
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create comment',
    })
  }
}

export const getCommentById = async (commentId: string) => {
  try {
    const comment = await useDB().query.comments.findFirst({
      where: eq(tables.comments.id, commentId),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        post: {
          columns: {
            id: true,
            title: true,
            teamId: true,
          },
        },
      },
    })

    if (!comment) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Comment not found',
      })
    }

    return comment
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      throw error
    }
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get comment by ID',
    })
  }
}

export const updateComment = async (
  commentId: string,
  userId: string,
  data: { content: string }
) => {
  try {
    const result = await useDB()
      .update(tables.comments)
      .set(data)
      .where(
        and(
          eq(tables.comments.id, commentId),
          eq(tables.comments.userId, userId)
        )
      )
      .returning()

    if (!result.length) {
      throw createError({
        statusCode: 403,
        statusMessage: 'You are not authorized to update this comment or it does not exist',
      })
    }

    return result[0]
  } catch (error) {
    if (error instanceof Error && error.message.includes('403')) {
      throw error
    }
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update comment',
    })
  }
}

export const deleteComment = async (commentId: string, userId: string) => {
  try {
    const result = await useDB()
      .delete(tables.comments)
      .where(
        and(
          eq(tables.comments.id, commentId),
          eq(tables.comments.userId, userId)
        )
      )
      .returning()

    if (!result.length) {
      throw createError({
        statusCode: 403,
        statusMessage: 'You are not authorized to delete this comment or it does not exist',
      })
    }

    return result[0]
  } catch (error) {
    if (error instanceof Error && error.message.includes('403')) {
      throw error
    }
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete comment',
    })
  }
}

export const approveComment = async (commentId: string) => {
  try {
    const result = await useDB()
      .update(tables.comments)
      .set({ isApproved: true })
      .where(eq(tables.comments.id, commentId))
      .returning()

    if (!result.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Comment not found',
      })
    }

    return result[0]
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      throw error
    }
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to approve comment',
    })
  }
}

export const flagComment = async (commentId: string) => {
  try {
    const result = await useDB()
      .update(tables.comments)
      .set({ flaggedAt: new Date() })
      .where(eq(tables.comments.id, commentId))
      .returning()

    if (!result.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Comment not found',
      })
    }

    return result[0]
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      throw error
    }
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to flag comment',
    })
  }
}

export const getUnapprovedComments = async (teamId: string, limit = 50) => {
  try {
    const comments = await useDB()
      .select({
        id: tables.comments.id,
        content: tables.comments.content,
        isApproved: tables.comments.isApproved,
        flaggedAt: tables.comments.flaggedAt,
        createdAt: tables.comments.createdAt,
        user: {
          id: tables.users.id,
          name: tables.users.name,
          avatarUrl: tables.users.avatarUrl,
        },
        post: {
          id: tables.posts.id,
          title: tables.posts.title,
          type: tables.posts.type,
        },
      })
      .from(tables.comments)
      .leftJoin(tables.users, eq(tables.comments.userId, tables.users.id))
      .leftJoin(tables.posts, eq(tables.comments.postId, tables.posts.id))
      .where(
        and(
          eq(tables.posts.teamId, teamId),
          eq(tables.comments.isApproved, false)
        )
      )
      .orderBy(desc(tables.comments.createdAt))
      .limit(limit)

    return comments
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get unapproved comments',
    })
  }
}
