import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	out: './drizzle',
	schema: './src/infrastructure/database/schema.ts',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.DB_URL ?? '',
	},
	// verbose: true,
	// strict: true,
});



