import dotenv from 'dotenv';
import path from 'path';


dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const config = {
  // nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.SERVER_PORT ?? 3000),
  dbUrl: process.env.DB_URL ?? '',
  // logLevel: process.env.LOG_LEVEL ?? 'info',
};
