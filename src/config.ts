import dotenv from 'dotenv';
import Config from './types/Config.js';

dotenv.config();

export const config: Config = {
  dbUrl: process.env.DATABASE_URL ?? '',
  port: Number(process.env.PORT) || 3000,
  nodeEnv: (process.env.NODE_ENV as 'development' | 'production' | 'test') ?? 'development',
};
