import express from 'express';
import { logger } from './infrastructure/logger/index.js'

const app = express();
const PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3000;

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
  });
}

export default app;
