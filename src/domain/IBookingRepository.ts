import { Booking } from './Booking.js';

export interface IBookingRepository {
  findByUserAndEvent(userId: string, eventId: number): Promise<Booking | null>;
  create(booking: Booking): Promise<Booking>;
  listByEvent(eventId: number): Promise<Booking[]>;
}
