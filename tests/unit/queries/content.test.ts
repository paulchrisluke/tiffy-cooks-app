import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createContent, getContentBySlug } from '@@/server/database/queries/content'

// Mock the database
const mockDB = {
  insert: vi.fn().mockReturnValue({
    values: vi.fn().mockReturnValue({
      returning: vi.fn().mockReturnValue({
        get: vi.fn().mockResolvedValue({
          id: 'test-id',
          title: 'Test Recipe',
          type: 'recipe',
          slug: 'test-recipe',
          userId: 'user-1',
          teamId: 'team-1',
          createdAt: new Date(),
        }),
      }),
    }),
  }),
  query: {
    posts: {
      findFirst: vi.fn().mockResolvedValue({
        id: 'test-id',
        title: 'Test Recipe',
        type: 'recipe',
        slug: 'test-recipe',
        is_public: true,
        userId: { id: 'user-1', name: 'Test User' },
        teamId: { id: 'team-1', name: 'Test Team' },
      }),
    },
  },
}

vi.mock('#app', () => ({
  useDB: () => mockDB,
}))

describe('Content Queries', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create recipe with all required fields', async () => {
    const recipeData = {
      title: 'Chocolate Chip Cookies',
      content: 'Delicious homemade cookies',
      type: 'recipe' as const,
      slug: 'chocolate-chip-cookies',
      difficulty: 'beginner' as const,
      prep_time: 15,
      cook_time: 12,
      servings: 24,
      ingredients: [
        { name: 'flour', amount: '2', unit: 'cups' },
        { name: 'chocolate chips', amount: '1', unit: 'cup' },
      ],
      instructions: [
        { step: 1, text: 'Mix dry ingredients' },
        { step: 2, text: 'Add wet ingredients' },
      ],
      userId: 'user-1',
      teamId: 'team-1',
    }

    const result = await createContent(recipeData)

    expect(result).toBeDefined()
    expect(result.title).toBe('Test Recipe')
    expect(result.type).toBe('recipe')
    expect(mockDB.insert).toHaveBeenCalledWith(expect.anything())
  })

  it('should get content by slug', async () => {
    const result = await getContentBySlug('test-recipe')

    expect(result).toBeDefined()
    expect(result.title).toBe('Test Recipe')
    expect(result.slug).toBe('test-recipe')
    expect(result.is_public).toBe(true)
    expect(mockDB.query.posts.findFirst).toHaveBeenCalled()
  })
})
