import { and, eq, desc, gte, sql } from 'drizzle-orm'
import { tables } from '@@/server/database/schema'
import type { AIInteractionFilters } from '@@/shared/validations/ai'

export const logInteraction = async (data: {
  userId?: string
  sessionId: string
  prompt: string
  response: string
  model: string
  tokensUsed?: number
  postId?: string
  meta?: Record<string, any>
}) => {
  try {
    const interaction = await useDB()
      .insert(tables.aiInteractions)
      .values(data)
      .returning()
      .get()

    return interaction
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to log AI interaction',
    })
  }
}

export const getUserInteractionCount = async (userId: string, timeframe: 'day' | 'week' | 'month' = 'day') => {
  try {
    let startDate: Date

    switch (timeframe) {
      case 'day':
        startDate = new Date(Date.now() - 24 * 60 * 60 * 1000)
        break
      case 'week':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        break
    }

    const result = await useDB()
      .select({ count: sql<number>`count(*)` })
      .from(tables.aiInteractions)
      .where(
        and(
          eq(tables.aiInteractions.userId, userId),
          gte(tables.aiInteractions.createdAt, startDate)
        )
      )
      .get()

    return result?.count || 0
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get user interaction count',
    })
  }
}

export const getInteractionsByPost = async (postId: string, limit = 20) => {
  try {
    const interactions = await useDB().query.aiInteractions.findMany({
      where: eq(tables.aiInteractions.postId, postId),
      orderBy: [desc(tables.aiInteractions.createdAt)],
      limit,
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    })

    return interactions
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get interactions by post',
    })
  }
}

export const getRecentInteractions = async (userId: string, limit = 10) => {
  try {
    const interactions = await useDB().query.aiInteractions.findMany({
      where: eq(tables.aiInteractions.userId, userId),
      orderBy: [desc(tables.aiInteractions.createdAt)],
      limit,
      with: {
        post: {
          columns: {
            id: true,
            title: true,
            slug: true,
            type: true,
          },
        },
      },
    })

    return interactions
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get recent interactions',
    })
  }
}

export const getAIInteractions = async (filters: AIInteractionFilters = {}) => {
  try {
    const conditions = []

    if (filters.userId) {
      conditions.push(eq(tables.aiInteractions.userId, filters.userId))
    }

    if (filters.postId) {
      conditions.push(eq(tables.aiInteractions.postId, filters.postId))
    }

    if (filters.timeframe) {
      let startDate: Date

      switch (filters.timeframe) {
        case 'day':
          startDate = new Date(Date.now() - 24 * 60 * 60 * 1000)
          break
        case 'week':
          startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'month':
          startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          break
      }

      conditions.push(gte(tables.aiInteractions.createdAt, startDate))
    }

    const interactions = await useDB().query.aiInteractions.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      orderBy: [desc(tables.aiInteractions.createdAt)],
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
        post: {
          columns: {
            id: true,
            title: true,
            slug: true,
            type: true,
          },
        },
      },
    })

    return interactions
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get AI interactions',
    })
  }
}

export const getAIStats = async (teamId?: string) => {
  try {
    const baseQuery = useDB()
      .select({
        totalInteractions: sql<number>`count(*)`,
        totalTokens: sql<number>`sum(${tables.aiInteractions.tokensUsed})`,
        uniqueUsers: sql<number>`count(distinct ${tables.aiInteractions.userId})`,
      })
      .from(tables.aiInteractions)

    let query = baseQuery

    if (teamId) {
      // Join with posts to filter by team
      query = useDB()
        .select({
          totalInteractions: sql<number>`count(*)`,
          totalTokens: sql<number>`sum(${tables.aiInteractions.tokensUsed})`,
          uniqueUsers: sql<number>`count(distinct ${tables.aiInteractions.userId})`,
        })
        .from(tables.aiInteractions)
        .leftJoin(tables.posts, eq(tables.aiInteractions.postId, tables.posts.id))
        .where(eq(tables.posts.teamId, teamId))
    }

    const result = await query.get()

    return {
      totalInteractions: result?.totalInteractions || 0,
      totalTokens: result?.totalTokens || 0,
      uniqueUsers: result?.uniqueUsers || 0,
    }
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get AI stats',
    })
  }
}
