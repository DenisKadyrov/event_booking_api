import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import type Config from '../../types/Config.js';
import * as schema from './schema.js';

const { Pool } = pg;

export type Database = NodePgDatabase<typeof schema>;

export function createDatabase({ config }: { config: Config }): Database {
  if (!config.dbUrl) {
    throw new Error('Database URL is not defined in config');
  }
  const pool = new Pool({
    connectionString: config.dbUrl,
    max: 10,
    idleTimeoutMillis: 30_000,
  });
  const db = drizzle(pool, { schema });
  return db;
}
