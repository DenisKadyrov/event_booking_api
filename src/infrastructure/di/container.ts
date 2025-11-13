import { createContainer, asValue, asFunction, asClass } from 'awilix';
import { config } from '../../config.js';
import { createDatabase } from '../database/client.js';
import { DrizzleEventRepository } from '../repositories/DrizzleEventRepository.js';
import { DrizzleBookingRepository } from '../repositories/DrizzleBookingRepository.js';
import { BookingService } from '../../application/services/BookingService.js';
import { EventService } from '../../application/services/EventService.js';
import { logger } from '../logger/index.js';
import { DrizzleUserRepository } from '../repositories/DrizzleUserRepository.js';
import { UserService } from '../../application/services/UserService.js';

const container = createContainer();

container.register({
  config: asValue(config),
  logger: asValue(logger),
  db: asFunction(createDatabase).singleton(),
  eventRepository: asFunction(({ db }) => new DrizzleEventRepository(db)).singleton(),
  bookingRepository: asFunction(({ db }) => new DrizzleBookingRepository(db)).singleton(),
  userRepository: asFunction(({ db }) => new DrizzleUserRepository(db)).singleton(),
  bookingService: asClass(BookingService).singleton(),
  eventService: asClass(EventService).singleton(),
  userService: asClass(UserService).singleton(),
});

export default container;
