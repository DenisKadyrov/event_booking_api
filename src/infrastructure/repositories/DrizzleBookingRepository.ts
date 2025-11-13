import type { IBookingRepository } from '../../domain/IBookingRepository.js';
import { Booking } from '../../domain/Booking.js';
import { bookings } from '../database/schema.js';
import { and, eq, sql } from 'drizzle-orm';
import type { Database } from '../database/client.js';
import { AlreadyBookedError } from '../../domain/errors.js';
import { isPostgresError, POSTGRES_ERROR_CODES } from '../database/types.js';

export class DrizzleBookingRepository implements IBookingRepository {
  private readonly db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async findByUserAndEvent(userId: string, eventId: number): Promise<Booking | null> {
    const rows = await this.db
      .select()
      .from(bookings)
      .where(and(eq(bookings.userId, userId), eq(bookings.eventId, eventId)))
      .limit(1);
    const row = rows[0];
    if (!row) return null;
    return new Booking(row.eventId, row.userId, row.id, row.createdAt ?? undefined);
  }

  async create(booking: Booking): Promise<Booking> {
    try {
      const rows = await this.db
        .insert(bookings)
        .values({
          eventId: booking.eventId,
          userId: booking.userId,
        })
        .returning();
      const row = rows[0];
      if (!row) {
        throw new Error('Failed to create booking: no row returned');
      }
      return new Booking(row.eventId, row.userId, row.id, row.createdAt ?? undefined);
    } catch (error: unknown) {
      // Обработка ошибки уникальности PostgreSQL
      if (isPostgresError(error) && error.code === POSTGRES_ERROR_CODES.UNIQUE_VIOLATION) {
        throw new AlreadyBookedError(booking.userId, booking.eventId);
      }
      throw error;
    }
  }

  async listByEvent(eventId: number): Promise<Booking[]> {
    const rows = await this.db.select().from(bookings).where(eq(bookings.eventId, eventId));
    return rows.map((r) => new Booking(r.eventId, r.userId, r.id, r.createdAt ?? undefined));
  }

  async countByEvent(eventId: number): Promise<number> {
    const result = await this.db
      .select({ count: sql<number>`count(*)::int` })
      .from(bookings)
      .where(eq(bookings.eventId, eventId));
    const count = result[0]?.count;
    if (typeof count !== 'number') {
      return 0;
    }
    return count;
  }
}
