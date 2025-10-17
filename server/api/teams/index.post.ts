import { createTeam } from '@@/server/database/queries/teams'
import { createTeamSchema } from '@@/shared/validations/team'
import { validateBody } from '@@/server/utils/bodyValidation'
import { useDB, tables } from '@@/server/utils/database'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const body = await validateBody(event, createTeamSchema)

  // Check for duplicate slug
  const db = useDB()
  const existingTeam = await db
    .select()
    .from(tables.teams)
    .where(eq(tables.teams.slug, body.slug))
    .get()

  if (existingTeam) {
    throw createError({
      statusCode: 400,
      statusMessage: 'A team with this slug already exists',
    })
  }

  const team = await createTeam({
    name: body.name,
    ownerId: user.id,
    slug: body.slug,
    logo: body.logo,
  })
  return team
})
