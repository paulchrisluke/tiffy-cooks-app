import { createError } from 'h3'

/**
 * Database error handling utilities for better error detection and messaging
 */

export interface DatabaseError extends Error {
  code?: string
  errno?: number
  sqlState?: string
}

/**
 * Checks if an error is a unique constraint violation
 * Works across different database engines (SQLite, PostgreSQL, MySQL)
 */
export function isUniqueConstraintError(error: unknown): boolean {
  if (!(error instanceof Error)) return false

  const errorMessage = error.message.toLowerCase()
  const errorCode = (error as DatabaseError).code?.toLowerCase()

  // SQLite error patterns
  if (errorMessage.includes('unique constraint failed')
    || errorMessage.includes('sqlite_constraint_unique')) {
    return true
  }

  // PostgreSQL error patterns
  if (errorCode === '23505' || errorMessage.includes('duplicate key value')) {
    return true
  }

  // MySQL error patterns
  if (errorCode === 'ER_DUP_ENTRY' || errorMessage.includes('duplicate entry')) {
    return true
  }

  return false
}

/**
 * Extracts the field name that caused a unique constraint violation
 * This is database-specific and may not work for all engines
 */
export function extractUniqueConstraintField(error: unknown): string | null {
  if (!(error instanceof Error)) return null

  const errorMessage = error.message

  // SQLite pattern: "UNIQUE constraint failed: table_name.field_name"
  const sqliteMatch = errorMessage.match(/UNIQUE constraint failed: \w+\.(\w+)/)
  if (sqliteMatch) {
    return sqliteMatch[1]
  }

  // PostgreSQL pattern: "duplicate key value violates unique constraint"
  // This is harder to extract without the constraint name
  // For now, return null to indicate we can't determine the field
  return null
}

/**
 * Creates a user-friendly error message for unique constraint violations
 */
export function createUniqueConstraintError(fieldName?: string): never {
  if (fieldName) {
    throw createError({
      statusCode: 400,
      statusMessage: `A record with this ${fieldName} already exists`,
    })
  }

  throw createError({
    statusCode: 400,
    statusMessage: 'A record with this information already exists',
  })
}

/**
 * Generic database error handler that provides appropriate error messages
 */
export function handleDatabaseError(error: unknown, operation: string): never {
  console.error(`Database error during ${operation}:`, error)

  if (isUniqueConstraintError(error)) {
    const fieldName = extractUniqueConstraintField(error)
    createUniqueConstraintError(fieldName)
  }

  throw createError({
    statusCode: 500,
    statusMessage: `Failed to ${operation}`,
  })
}
