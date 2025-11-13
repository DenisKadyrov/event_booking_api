/**
 * Тип для ошибки PostgreSQL
 */
export interface PostgresError extends Error {
  code?: string;
  detail?: string;
  constraint?: string;
  table?: string;
  column?: string;
}

/**
 * Type guard для проверки, является ли ошибка ошибкой PostgreSQL
 */
export function isPostgresError(error: unknown): error is PostgresError {
  return (
    error !== null &&
    typeof error === 'object' &&
    'code' in error &&
    typeof (error as PostgresError).code === 'string'
  );
}

/**
 * Коды ошибок PostgreSQL
 */
export const POSTGRES_ERROR_CODES = {
  UNIQUE_VIOLATION: '23505',
  FOREIGN_KEY_VIOLATION: '23503',
  NOT_NULL_VIOLATION: '23502',
} as const;

