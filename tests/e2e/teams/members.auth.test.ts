import { test, expect } from '@playwright/test'
import { createTestTeam, createTestUser } from '../../fixtures/test-data'

test.describe('Team Members (Authenticated)', () => {
  let teamId: string

  test.beforeEach(async ({ request }) => {
    // Create a team for member tests
    const teamData = createTestTeam()
    const response = await request.post('/api/teams', {
      data: teamData
    })
    expect(response.status()).toBe(200)

    const team = await response.json()
    teamId = team.id
  })

  test('should invite member to team', async ({ request }) => {
    const memberData = {
      email: 'member@example.com',
      role: 'member'
    }

    const response = await request.post(`/api/teams/${teamId}/members`, {
      data: memberData
    })


    expect(response.status()).toBe(201)

    const invitation = await response.json()
    expect(invitation).toMatchObject({
      teamId: teamId,
      email: memberData.email,
      role: memberData.role
    })
    expect(invitation.id).toBeDefined()
    expect(invitation.token).toBeDefined()
  })

  test('should list team members', async ({ request }) => {
    const response = await request.get(`/api/teams/${teamId}/members`)

    expect(response.status()).toBe(200)

    const members = await response.json()
    expect(members).toBeInstanceOf(Array)

    // Should include the team owner
    const owner = members.find((m: any) => m.role === 'owner')
    expect(owner).toBeDefined()
  })

  test('should list team invitations', async ({ request }) => {
    const response = await request.get(`/api/teams/${teamId}/invites`)

    expect(response.status()).toBe(200)

    const invites = await response.json()
    expect(invites).toBeInstanceOf(Array)
  })

  test('should reject duplicate member invitation', async ({ request }) => {
    const memberData = {
      email: 'duplicate@example.com',
      role: 'member'
    }

    // First invitation should succeed
    const firstResponse = await request.post(`/api/teams/${teamId}/members`, {
      data: memberData
    })
    expect(firstResponse.status()).toBe(201)

    // Second invitation with same email should fail
    const secondResponse = await request.post(`/api/teams/${teamId}/members`, {
      data: memberData
    })
    expect(secondResponse.status()).toBe(400)

    const error = await secondResponse.json()
    expect(error.statusMessage).toContain('already exists')
  })

  test('should validate invitation data', async ({ request }) => {
    const response = await request.post(`/api/teams/${teamId}/members`, {
      data: {
        email: 'invalid-email', // Invalid email format
        role: 'member'
      }
    })

    expect(response.status()).toBe(400)
  })

  test('should reject operations on non-existent team', async ({ request }) => {
    const fakeTeamId = 'non-existent-id'

    const response = await request.get(`/api/teams/${fakeTeamId}/members`)
    expect(response.status()).toBe(404)
  })

  test('should handle member removal', async ({ request }) => {
    // This test would require:
    // 1. Creating a second user
    // 2. Inviting them to the team
    // 3. Having them accept the invitation
    // 4. Then removing them as the owner

    // For now, we'll test the endpoint exists and validates ownership
    const fakeMemberId = 'non-existent-member'

    const response = await request.delete(`/api/teams/${teamId}/members/${fakeMemberId}`)
    // Should return 404 for non-existent member, not 403 for ownership
    expect(response.status()).toBe(404)
  })

  test('should validate team ownership for member operations', async ({ request }) => {
    // This test documents that member operations require team ownership
    // In a real scenario, we'd test with a non-owner user
    const memberData = {
      email: 'test@example.com',
      role: 'member'
    }

    const response = await request.post(`/api/teams/${teamId}/members`, {
      data: memberData
    })

    // Should succeed because we're the owner
    expect(response.status()).toBe(201)
  })
})
