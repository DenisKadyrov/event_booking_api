import type { Config } from './Config.js';
import type { Database } from '../infrastructure/database/client.js';
import type { DrizzleEventRepository } from '../infrastructure/repositories/DrizzleEventRepository.js';
import type { DrizzleBookingRepository } from '../infrastructure/repositories/DrizzleBookingRepository.js';
import type { BookingService } from '../application/services/BookingService.js';
import type { Logger } from 'pino';
import type { DrizzleUserRepository } from '../infrastructure/repositories/DrizzleUserRepository.js';
import type { EventService } from '../application/services/EventService.js';
import type { UserService } from '../application/services/UserService.js';

declare module 'awilix' {
  interface Cradle {
    config: Config;
    logger: Logger;
    db: Database;
    eventRepository: DrizzleEventRepository;
    bookingRepository: DrizzleBookingRepository;
    userRepository: DrizzleUserRepository;
    bookingService: BookingService;
    eventService: EventService;
    userService: UserService;
  }
}
