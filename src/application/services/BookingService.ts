import { Booking } from '../../domain/Booking.js';
import type { IBookingRepository } from '../../domain/IBookingRepository.js';
import type { IEventRepository } from '../../domain/IEventRepository.js';
import {
  AlreadyBookedError,
  EventNotFoundError,
  InvalidInputError,
  SeatUnavailableError,
} from '../../domain/errors.js';

export interface ReserveSeatInput {
  eventId: number;
  userId: string;
}

export class BookingService {
  constructor(
    private readonly bookingRepository: IBookingRepository,
    private readonly eventRepository: IEventRepository,
  ) {}

  async reserveSeat({ eventId, userId }: ReserveSeatInput): Promise<Booking> {
    const trimmedUserId = userId.trim();
    if (!trimmedUserId) {
      throw new InvalidInputError('User id must not be empty');
    }

    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new EventNotFoundError(eventId);
    }

    const existingBooking = await this.bookingRepository.findByUserAndEvent(trimmedUserId, eventId);

    if (existingBooking) {
      throw new AlreadyBookedError(trimmedUserId, eventId);
    }

    const bookings = await this.bookingRepository.listByEvent(eventId);

    if (bookings.length >= event.totalSeats) {
      throw new SeatUnavailableError(eventId);
    }

    const booking = new Booking(eventId, trimmedUserId);

    return this.bookingRepository.create(booking);
  }
}
