import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import Config from '../../types/Config.js';

const { Pool } = pg;

export async function createDatabase({ config }: { config: Config }) {
	if (!config.dbUrl) {
		throw new Error("Database URL is not defined in config");
	}
	const pool = new Pool({
		connectionString: config.dbUrl,
		max: 10,
		idleTimeoutMillis: 30_000,
	});
	const db = drizzle(pool);
	return db;
}



