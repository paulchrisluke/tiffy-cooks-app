import { test, expect } from '@playwright/test'
import { createTestTeam } from '../../fixtures/test-data'

test.describe('Team Creation (Authenticated)', () => {
  const createdTeamIds: string[] = []

  test.afterEach(async ({ request }) => {
    // Clean up created teams
    for (const teamId of createdTeamIds) {
      const res = await request.delete(`/api/teams/${teamId}`)

      // Treat 404 as a no-op (team already deleted)
      if (res.status() === 404) {
        continue
      }

      // Log warning for any non-2xx statuses
      if (res.status() < 200 || res.status() >= 300) {
        let errorDetails = ''
        try {
          const contentType = res.headers()['content-type']
          if (contentType?.includes('application/json')) {
            const errorBody = await res.json()
            errorDetails = JSON.stringify(errorBody)
          } else {
            errorDetails = await res.text()
          }
        } catch {
          errorDetails = 'Unable to parse error response'
        }
        console.warn(`Failed to delete team ${teamId}: status ${res.status()}, details: ${errorDetails}`)
      }
    }
    // Reset the array
    createdTeamIds.length = 0
  })

  test('should create team with valid data', async ({ request }) => {
    const teamData = createTestTeam()

    const response = await request.post('/api/teams', {
      data: teamData
    })


    expect(response.status()).toBe(200)

    const team = await response.json()
    expect(team).toMatchObject({
      name: teamData.name,
      slug: teamData.slug,
      logo: teamData.logo
    })
    expect(team.id).toBeDefined()
    expect(team.ownerId).toBeDefined()
    expect(team.createdAt).toBeDefined()

    // Register team for cleanup
    if (team.id) {
      createdTeamIds.push(team.id)
    }
  })

  test('should verify team appears in user teams list', async ({ request }) => {
    const teamData = createTestTeam()

    // Create team
    const createResponse = await request.post('/api/teams', {
      data: teamData
    })
    expect(createResponse.status()).toBe(200)

    const createdTeam = await createResponse.json()

    // Register team for cleanup
    if (createdTeam.id) {
      createdTeamIds.push(createdTeam.id)
    }

    // Get user's teams
    const listResponse = await request.get('/api/teams')
    expect(listResponse.status()).toBe(200)

    const teams = await listResponse.json()
    expect(teams).toBeInstanceOf(Array)
    expect(teams.length).toBeGreaterThan(0)

    const foundTeam = teams.find((t: any) => t.id === createdTeam.id)
    expect(foundTeam).toBeDefined()
    expect(foundTeam.name).toBe(teamData.name)
  })

  test('should reject duplicate slug', async ({ request }) => {
    const uniqueId = Date.now() + Math.floor(Math.random() * 1000)
    const teamData = createTestTeam(`first-${uniqueId}`)

    // First team creation should succeed
    const firstResponse = await request.post('/api/teams', {
      data: teamData
    })
    expect(firstResponse.status()).toBe(200)

    // Register first team for cleanup
    const firstTeam = await firstResponse.json()
    if (firstTeam.id) {
      createdTeamIds.push(firstTeam.id)
    }

    // Second team with same slug should fail
    const secondTeamData = createTestTeam(`second-${uniqueId}`)
    secondTeamData.slug = teamData.slug // Same slug

    const secondResponse = await request.post('/api/teams', {
      data: secondTeamData
    })
    expect(secondResponse.status()).toBe(400)
  })

  test('should validate required fields', async ({ request }) => {
    // Missing name
    const response1 = await request.post('/api/teams', {
      data: {
        slug: 'test-slug'
        // Missing name
      }
    })
    expect(response1.status()).toBe(400)

    // Missing slug
    const response2 = await request.post('/api/teams', {
      data: {
        name: 'Test Team'
        // Missing slug
      }
    })
    expect(response2.status()).toBe(400)
  })

  test('should validate slug format', async ({ request }) => {
    const teamData = createTestTeam()
    teamData.slug = 'Invalid Slug!' // Invalid characters

    const response = await request.post('/api/teams', {
      data: teamData
    })

    expect(response.status()).toBe(400)
  })
})
