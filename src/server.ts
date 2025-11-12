import express from 'express';
import container from './infrastructure/di/container.js';
import { createBookingRouter } from './interfaces/http/routes/bookings.js';
import { errorHandler } from './interfaces/http/middleware/errorHandler.js';
import { logger } from './infrastructure/logger/index.js';
import { config } from './config.js';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const bookingService = container.resolve('bookingService');
app.use('/api/bookings', createBookingRouter({ bookingService }));

app.use(errorHandler);

if (config.nodeEnv !== 'test') {
  app.listen(config.port, () => {
    logger.info(`Server running on port ${config.port}`);
  });
}

export default app;
