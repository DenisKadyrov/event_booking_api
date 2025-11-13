import type { Config } from './Config.js';
import type { Database } from '../infrastructure/database/client.js';
import type { DrizzleEventRepository } from '../infrastructure/repositories/DrizzleEventRepository.js';
import type { DrizzleBookingRepository } from '../infrastructure/repositories/DrizzleBookingRepository.js';
import type { BookingService } from '../application/services/BookingService.js';
import type { Logger } from 'pino';

declare module 'awilix' {
  interface Cradle {
    config: Config;
    logger: Logger;
    db: Database;
    eventRepository: DrizzleEventRepository;
    bookingRepository: DrizzleBookingRepository;
    bookingService: BookingService;
  }
}
