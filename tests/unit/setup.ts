import { config } from '@vue/test-utils'

// Global test setup
config.global.mocks = {
  $t: (msg: string) => msg, // Mock i18n
}

// Mock Nuxt composables
vi.mock('#app', () => ({
  useRuntimeConfig: () => ({
    openaiApiKey: 'test-key',
    baseUrl: 'http://localhost:3000'
  }),
  useDB: () => ({
    query: {
      posts: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
      },
      comments: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
      },
      aiInteractions: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
      },
    },
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockReturnValue({
          get: vi.fn(),
        }),
      }),
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockReturnValue({
            get: vi.fn(),
          }),
        }),
      }),
    }),
    delete: vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        returning: vi.fn().mockReturnValue({
          get: vi.fn(),
        }),
      }),
    }),
  }),
  useUserSession: () => ({
    user: { value: { id: 'test-user', name: 'Test User', email: 'test@example.com' } },
    loggedIn: { value: true },
  }),
  requireUserSession: vi.fn().mockResolvedValue({
    user: { id: 'test-user', name: 'Test User', email: 'test@example.com' }
  }),
}))
