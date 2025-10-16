import { nanoid } from 'nanoid'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { users } from './users'
import { posts } from './posts'
import { relations } from 'drizzle-orm'

export const aiInteractions = sqliteTable('ai_interactions', {
  id: text('id')
    .primaryKey()
    .$default(() => nanoid()),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'set null' }),
  sessionId: text('session_id').notNull(), // for anonymous tracking
  prompt: text('prompt').notNull(),
  response: text('response').notNull(),
  model: text('model').notNull().default('gpt-4'),
  tokensUsed: integer('tokens_used'),
  postId: text('post_id')
    .references(() => posts.id, { onDelete: 'set null' }), // context recipe
  meta: text('meta', { mode: 'json' }), // for additional metadata
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$default(() => new Date()),
})

export const aiInteractionsRelations = relations(aiInteractions, ({ one }) => ({
  user: one(users, {
    fields: [aiInteractions.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [aiInteractions.postId],
    references: [posts.id],
  }),
}))
