import { nanoid } from 'nanoid'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { users } from './users'
import { teams } from './teams'
import { relations } from 'drizzle-orm'

export const posts = sqliteTable('posts', {
  id: text('id')
    .primaryKey()
    .$default(() => nanoid()),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  image: text('image'),
  teamId: text('teamId')
    .notNull()
    .references(() => teams.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  // Content type system - supports recipes, lessons, and posts
  type: text('type').notNull().default('post'), // 'recipe', 'lesson', 'post'
  slug: text('slug').notNull().unique(),
  // Recipe-specific fields (schema.org Recipe compliance)
  tags: text('tags', { mode: 'json' }).$type<string[]>(),
  difficulty: text('difficulty'), // 'beginner', 'intermediate', 'advanced'
  prep_time: integer('prep_time'), // minutes
  cook_time: integer('cook_time'), // minutes
  servings: integer('servings'),
  ingredients: text('ingredients', { mode: 'json' }).$type<Array<{ name: string, amount: string, unit?: string }>>(),
  instructions: text('instructions', { mode: 'json' }).$type<Array<{ step: number, text: string }>>(),
  // Publishing controls
  is_public: integer('is_public', { mode: 'boolean' }).notNull().default(false),
  is_featured: integer('is_featured', { mode: 'boolean' }).notNull().default(false),
  published_at: integer('published_at', { mode: 'timestamp' }),
  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$default(
    () => new Date(),
  ).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$onUpdate(
    () => new Date(),
  ).notNull(),
})

export const postsRelations = relations(posts, ({ one }) => ({
  userId: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  teamId: one(teams, {
    fields: [posts.teamId],
    references: [teams.id],
  }),
}))
