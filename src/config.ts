import dotenv from 'dotenv';
import type Config from './types/Config.js';

dotenv.config();

function parsePort(port: string | undefined): number {
  if (!port) return 3000;
  const parsed = Number.parseInt(port, 10);
  if (Number.isNaN(parsed) || parsed < 1 || parsed > 65535) {
    return 3000;
  }
  return parsed;
}

function parseNodeEnv(env: string | undefined): Config['nodeEnv'] {
  if (env === 'production' || env === 'test' || env === 'development') {
    return env;
  }
  return 'development';
}

export const config: Config = {
  dbUrl: process.env.DATABASE_URL ?? '',
  port: parsePort(process.env.PORT),
  nodeEnv: parseNodeEnv(process.env.NODE_ENV),
};
