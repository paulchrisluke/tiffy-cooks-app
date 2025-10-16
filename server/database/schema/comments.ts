import { nanoid } from 'nanoid'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { users } from './users'
import { posts } from './posts'
import { relations } from 'drizzle-orm'

export const comments = sqliteTable('comments', {
  id: text('id')
    .primaryKey()
    .$default(() => nanoid()),
  postId: text('post_id')
    .notNull()
    .references(() => posts.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  parentId: text('parent_id')
    .references(() => comments.id, { onDelete: 'cascade' }), // for nested replies
  content: text('content').notNull(),
  isApproved: integer('is_approved', { mode: 'boolean' })
    .notNull()
    .default(false),
  flaggedAt: integer('flagged_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$default(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$onUpdate(() => new Date()),
})

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
  }),
}))
