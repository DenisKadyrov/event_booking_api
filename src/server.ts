import express, { type Request, type Response } from 'express';
import container from './infrastructure/di/container.js';
import { setupSwagger } from './infrastructure/swagger.js';
import { createBookingRouter } from './interfaces/http/routes/bookings.js';
import { errorHandler } from './interfaces/http/middleware/errorHandler.js';
import { logger } from './infrastructure/logger/index.js';
import { config } from './config.js';
import { createEventRouter } from './interfaces/http/routes/events.js';
import { createUserRouter } from './interfaces/http/routes/users.js';

interface HealthResponse {
  status: 'ok';
}

const app = express();

setupSwagger(app);

app.use(express.json());

app.get('/health', (_req: Request, res: Response<HealthResponse>) => {
  res.json({ status: 'ok' });
});

const bookingService = container.resolve('bookingService');
app.use('/api/bookings', createBookingRouter({ bookingService }));

const eventService = container.resolve('eventService');
app.use('/api/events', createEventRouter({ eventService }));

const userService = container.resolve('userService');
app.use('/api/users', createUserRouter({ userService }));

app.use(errorHandler);

if (config.nodeEnv !== 'test') {
  app.listen(config.port, () => {
    logger.info(`Server running on http://localhost:${config.port}`);
  });
}

export default app;
