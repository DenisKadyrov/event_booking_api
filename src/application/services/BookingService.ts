import { Booking } from '../../domain/Booking.js';
import type { IBookingRepository } from '../../domain/IBookingRepository.js';
import type { IEventRepository } from '../../domain/IEventRepository.js';
import {
  AlreadyBookedError,
  EventNotFoundError,
  InvalidInputError,
  SeatUnavailableError,
} from '../../domain/errors.js';
import type { Database } from '../../infrastructure/database/client.js';
import { DrizzleEventRepository } from '../../infrastructure/repositories/DrizzleEventRepository.js';
import { DrizzleBookingRepository } from '../../infrastructure/repositories/DrizzleBookingRepository.js';

export interface ReserveSeatInput {
  eventId: number;
  userId: string;
}

export class BookingService {
  bookingRepository: IBookingRepository;
  eventRepository: IEventRepository;
  db: Database;

  constructor({
    bookingRepository,
    eventRepository,
    db,
  }: {
    bookingRepository: IBookingRepository;
    eventRepository: IEventRepository;
    db: Database;
  }) {
    this.bookingRepository = bookingRepository;
    this.eventRepository = eventRepository;
    this.db = db;
  }

  async reserveSeat({ eventId, userId }: ReserveSeatInput): Promise<Booking> {
    const trimmedUserId = userId.trim();
    if (!trimmedUserId) {
      throw new InvalidInputError('User id must not be empty');
    }

    // Используем транзакцию для предотвращения race condition
    return await this.db.transaction(async (tx) => {
      // Создаем транзакционные репозитории
      const txEventRepository = new DrizzleEventRepository(tx);
      const txBookingRepository = new DrizzleBookingRepository(tx);

      // Проверяем существование события
      const event = await txEventRepository.findById(eventId);
      if (!event) {
        throw new EventNotFoundError(eventId);
      }

      // Проверяем, не забронировал ли уже пользователь место
      const existingBooking = await txBookingRepository.findByUserAndEvent(trimmedUserId, eventId);
      if (existingBooking) {
        throw new AlreadyBookedError(trimmedUserId, eventId);
      }

      // Проверяем доступность мест (используем count для оптимизации)
      const bookingsCount = await txBookingRepository.countByEvent(eventId);
      if (bookingsCount >= event.totalSeats) {
        throw new SeatUnavailableError(eventId);
      }

      // Создаем бронирование
      const booking = new Booking(eventId, trimmedUserId);
      return txBookingRepository.create(booking);
    });
  }
}
