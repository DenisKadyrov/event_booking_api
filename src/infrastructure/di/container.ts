import { createContainer, asValue, asFunction, asClass } from 'awilix';
import { config } from '../../config.js';
import { createDatabase } from '../database/client.js';
import { DrizzleEventRepository } from '../repositories/DrizzleEventRepository.js';
import { DrizzleBookingRepository } from '../repositories/DrizzleBookingRepository.js';
import { BookingService } from '../../application/services/BookingService.js';
import { logger } from '../logger/index.js';

const container = createContainer();

container.register({
  config: asValue(config),
  logger: asValue(logger),
  db: asFunction(createDatabase).singleton(),
  eventRepository: asFunction(({ db }) => new DrizzleEventRepository(db)).singleton(),
  bookingRepository: asFunction(({ db }) => new DrizzleBookingRepository(db)).singleton(),
  bookingService: asClass(BookingService).singleton(),
});

export default container;
