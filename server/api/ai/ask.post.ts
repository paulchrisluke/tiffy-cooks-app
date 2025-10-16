import { aiRequestSchema } from '@@/shared/validations/ai'
import { validateBody } from '@@/server/utils/bodyValidation'
import { logInteraction, getUserInteractionCount } from '@@/server/database/queries/ai'
import { nanoid } from 'nanoid'

export default defineEventHandler(async (event) => {
  // 1. Validate request body
  const data = await validateBody(event, aiRequestSchema)

  // 2. Get OpenAI API key from runtime config
  const config = useRuntimeConfig()
  const openaiApiKey = config.openaiApiKey

  if (!openaiApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'OpenAI API key not configured',
    })
  }

  // 3. Check rate limiting for authenticated users
  let userId: string | undefined
  let sessionId = data.sessionId || nanoid()

  try {
    const { user } = await requireUserSession(event)
    userId = user.id
    sessionId = sessionId // Use provided sessionId or generate new one

    // Check daily rate limit (3 requests for free users, unlimited for pro)
    const dailyCount = await getUserInteractionCount(userId, 'day')
    const isProUser = user.proAccount

    if (!isProUser && dailyCount >= 3) {
      throw createError({
        statusCode: 429,
        statusMessage: 'Daily rate limit exceeded. Upgrade to pro for unlimited AI requests.',
      })
    }
  } catch (error) {
    // User not authenticated - allow anonymous usage with session tracking
    if (error instanceof Error && error.message.includes('401')) {
      // Continue with anonymous user
    } else {
      throw error
    }
  }

  // 4. Call OpenAI API
  try {
    const openaiResponse = await $fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: {
        model: data.model || 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are Tiffy, a helpful cooking assistant. You provide friendly, practical cooking advice, recipe suggestions, and cooking tips. Keep responses concise and helpful.',
          },
          {
            role: 'user',
            content: data.prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      },
    })

    const response = openaiResponse.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

    // 5. Log interaction
    await logInteraction({
      userId,
      sessionId,
      prompt: data.prompt,
      response,
      model: data.model || 'gpt-4',
      tokensUsed: openaiResponse.usage?.total_tokens,
      postId: data.postId,
      meta: {
        userAgent: getHeader(event, 'user-agent'),
        ip: getClientIP(event),
      },
    })

    // 6. Return response
    return {
      response,
      model: data.model || 'gpt-4',
      tokensUsed: openaiResponse.usage?.total_tokens,
      sessionId,
    }
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get AI response',
    })
  }
})
