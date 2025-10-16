import { and, eq, desc, asc, like, inArray, or, sql } from 'drizzle-orm'
import { tables } from '@@/server/database/schema'
import type { CreateContentInput, ContentFilters } from '@@/shared/validations/content'

export const getAllContent = async (teamId: string, filters: ContentFilters = {}) => {
  try {
    const conditions = [eq(tables.posts.teamId, teamId)]

    // Apply filters
    if (filters.type) {
      conditions.push(eq(tables.posts.type, filters.type))
    }

    if (filters.tags && filters.tags.length > 0) {
      // SQLite JSON search for tags
      conditions.push(
        sql`JSON_EXTRACT(${tables.posts.tags}, '$') IS NOT NULL`
      )
      // Note: For more complex tag filtering, we'd need to use a separate tags table
    }

    if (filters.difficulty) {
      conditions.push(eq(tables.posts.difficulty, filters.difficulty))
    }

    if (filters.is_public !== undefined) {
      conditions.push(eq(tables.posts.is_public, filters.is_public))
    }

    if (filters.is_featured !== undefined) {
      conditions.push(eq(tables.posts.is_featured, filters.is_featured))
    }

    const posts = await useDB().query.posts.findMany({
      where: and(...conditions),
      orderBy: [desc(tables.posts.createdAt)],
      limit: filters.limit || 20,
      offset: filters.offset || 0,
      with: {
        userId: {
          columns: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    })

    return posts
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get all content',
    })
  }
}

export const getPublicContent = async (filters: ContentFilters = {}) => {
  try {
    const conditions = [eq(tables.posts.is_public, true)]

    // Apply filters
    if (filters.type) {
      conditions.push(eq(tables.posts.type, filters.type))
    }

    if (filters.difficulty) {
      conditions.push(eq(tables.posts.difficulty, filters.difficulty))
    }

    if (filters.is_featured !== undefined) {
      conditions.push(eq(tables.posts.is_featured, filters.is_featured))
    }

    const posts = await useDB().query.posts.findMany({
      where: and(...conditions),
      orderBy: [desc(tables.posts.published_at), desc(tables.posts.createdAt)],
      limit: filters.limit || 20,
      offset: filters.offset || 0,
      with: {
        userId: {
          columns: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        teamId: {
          columns: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })

    return posts
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get public content',
    })
  }
}

export const getContentBySlug = async (slug: string) => {
  try {
    const post = await useDB().query.posts.findFirst({
      where: and(
        eq(tables.posts.slug, slug),
        eq(tables.posts.is_public, true)
      ),
      with: {
        userId: {
          columns: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        teamId: {
          columns: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })

    if (!post) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Content not found',
      })
    }

    return post
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      throw error
    }
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get content by slug',
    })
  }
}

export const getFeaturedContent = async (limit = 10) => {
  try {
    const posts = await useDB().query.posts.findMany({
      where: and(
        eq(tables.posts.is_public, true),
        eq(tables.posts.is_featured, true)
      ),
      orderBy: [desc(tables.posts.published_at)],
      limit,
      with: {
        userId: {
          columns: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        teamId: {
          columns: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })

    return posts
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get featured content',
    })
  }
}

export const createContent = async (data: CreateContentInput & { userId: string, teamId: string }) => {
  try {
    const newPost = await useDB()
      .insert(tables.posts)
      .values({
        ...data,
        // Ensure slug is unique by appending timestamp if needed
        slug: data.slug,
      })
      .returning()
      .get()

    return newPost
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create content',
    })
  }
}

export const getContentById = async (id: string, teamId: string, userId: string) => {
  try {
    const post = await useDB().query.posts.findFirst({
      where: and(
        eq(tables.posts.id, id),
        eq(tables.posts.teamId, teamId),
        eq(tables.posts.userId, userId)
      ),
    })

    if (!post) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Content not found or you are not authorized to view it',
      })
    }

    return post
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      throw error
    }
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get content by ID',
    })
  }
}

export const updateContent = async (
  id: string,
  teamId: string,
  userId: string,
  data: Partial<CreateContentInput>
) => {
  try {
    const result = await useDB()
      .update(tables.posts)
      .set(data)
      .where(
        and(
          eq(tables.posts.id, id),
          eq(tables.posts.teamId, teamId),
          eq(tables.posts.userId, userId)
        )
      )
      .returning()

    if (!result.length) {
      throw createError({
        statusCode: 403,
        statusMessage: 'You are not authorized to update this content or it does not exist',
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
      statusMessage: 'Failed to update content',
    })
  }
}

export const deleteContent = async (id: string, teamId: string, userId: string) => {
  try {
    const result = await useDB()
      .delete(tables.posts)
      .where(
        and(
          eq(tables.posts.id, id),
          eq(tables.posts.teamId, teamId),
          eq(tables.posts.userId, userId)
        )
      )
      .returning()

    if (!result.length) {
      throw createError({
        statusCode: 403,
        statusMessage: 'You are not authorized to delete this content or it does not exist',
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
      statusMessage: 'Failed to delete content',
    })
  }
}

export const publishContent = async (id: string, teamId: string) => {
  try {
    const result = await useDB()
      .update(tables.posts)
      .set({
        is_public: true,
        published_at: new Date(),
      })
      .where(
        and(
          eq(tables.posts.id, id),
          eq(tables.posts.teamId, teamId)
        )
      )
      .returning()

    if (!result.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Content not found',
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
      statusMessage: 'Failed to publish content',
    })
  }
}
