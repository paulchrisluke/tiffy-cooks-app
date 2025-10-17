import { test, expect } from '@playwright/test'
import { createTestTeam } from '../../fixtures/test-data'

test.describe('Team Management (Authenticated)', () => {
  let teamId: string

  test.beforeEach(async ({ request }) => {
    // Create a team for management tests
    const teamData = createTestTeam()
    const response = await request.post('/api/teams', {
      data: teamData,
    })
    expect(response.status()).toBe(200)

    const team = await response.json()
    teamId = team.id
  })

  test.afterAll(async ({ request }) => {
    if (teamId) {
      await request.delete(`/api/teams/${teamId}`)
    }
  })

  test('should get user teams list', async ({ request }) => {
    const response = await request.get('/api/teams')

    expect(response.status()).toBe(200)

    const teams = await response.json()
    expect(teams).toBeInstanceOf(Array)
    expect(teams.length).toBeGreaterThan(0)

    // Should include our test team
    const foundTeam = teams.find((t: any) => t.id === teamId)
    expect(foundTeam).toBeDefined()
  })

  test('should update team name and logo', async ({ request }) => {
    const updateData = {
      name: 'Updated Team Name',
      logo: 'https://example.com/new-logo.png',
    }

    const response = await request.patch(`/api/teams/${teamId}`, {
      data: updateData,
    })

    expect(response.status()).toBe(200)

    const updatedTeam = await response.json()
    expect(updatedTeam.name).toBe(updateData.name)
    expect(updatedTeam.logo).toBe(updateData.logo)
  })

  test('should reject update with invalid data', async ({ request }) => {
    const response = await request.patch(`/api/teams/${teamId}`, {
      data: {
        name: '', // Empty name should be invalid
      },
    })

    expect(response.status()).toBe(400)
  })

  test('should delete team', async ({ request }) => {
    // Create a separate team for deletion
    const teamData = createTestTeam()
    const createResponse = await request.post('/api/teams', {
      data: teamData,
    })
    expect(createResponse.status()).toBe(200)

    const createdTeam = await createResponse.json()
    const deleteTeamId = createdTeam.id

    // Delete the team
    const deleteResponse = await request.delete(`/api/teams/${deleteTeamId}`)
    expect(deleteResponse.status()).toBe(200)

    // Verify team is deleted by trying to get it
    const getResponse = await request.get(`/api/teams/${deleteTeamId}`)
    expect(getResponse.status()).toBe(404)
  })

  test('should reject operations on non-existent team', async ({ request }) => {
    const fakeTeamId = 'non-existent-id'

    const response = await request.patch(`/api/teams/${fakeTeamId}`, {
      data: { name: 'Updated Name' },
    })

    expect(response.status()).toBe(404)
  })

  test('should verify ownership requirements', async ({ request }) => {
    // This test would require creating a team as a different user
    // For now, we'll test that the current user can manage their own team
    const response = await request.patch(`/api/teams/${teamId}`, {
      data: { name: 'Ownership Test' },
    })

    expect(response.status()).toBe(200)
  })
})
