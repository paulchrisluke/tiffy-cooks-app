// server/utils/teamValidation.ts
import type { H3Event } from 'h3'
import { findUserTeams } from '@@/server/database/queries/teams'

export async function validateTeamOwnership(event: H3Event, teamId: string) {
  // 1. Get authenticated user
  const { user } = await requireUserSession(event)

  if (!teamId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Team ID is required',
    })
  }

  // 2. Get user's teams to check ownership
  const userTeams = await findUserTeams(user.id)
  const team = userTeams.find((t) => t.id === teamId)

  if (!team) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Team not found',
    })
  }

  // 3. Check if user is the owner
  if (team.role !== 'owner') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Only team owners can perform this action',
    })
  }

  return { user, team }
}

export async function validateCreatorOrOwner(event: H3Event, teamId: string) {
  // 1. Get authenticated user
  const { user } = await requireUserSession(event)

  if (!teamId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Team ID is required',
    })
  }

  // 2. Get user's teams to check role
  const userTeams = await findUserTeams(user.id)
  const team = userTeams.find((t) => t.id === teamId)

  if (!team) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Team not found',
    })
  }

  // 3. Check if user is creator or above
  if (!['creator', 'admin', 'owner'].includes(team.role)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Only creators, admins, or owners can perform this action',
    })
  }

  return { user, team }
}

export async function canModerateContent(userId: string, teamId: string) {
  try {
    const userTeams = await findUserTeams(userId)
    const team = userTeams.find((t) => t.id === teamId)

    if (!team) {
      return false
    }

    // Creators, admins, and owners can moderate content
    return ['creator', 'admin', 'owner'].includes(team.role)
  } catch (error) {
    console.error('Error checking moderation permissions:', error)
    return false
  }
}

export async function requireCreatorRole(event: H3Event, teamId: string) {
  return await validateCreatorOrOwner(event, teamId)
}
