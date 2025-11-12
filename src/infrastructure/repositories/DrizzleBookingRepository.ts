import type { IBookingRepository } from '../../domain/IBookingRepository.js';
import { Booking } from '../../domain/Booking.js';
import { bookings } from '../database/schema.js';
import { and, eq, sql } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { AlreadyBookedError } from '../../domain/errors.js';

export class DrizzleBookingRepository implements IBookingRepository {
  private readonly db: NodePgDatabase;

  constructor(db: NodePgDatabase) {
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
      return new Booking(row.eventId, row.userId, row.id, row.createdAt ?? undefined);
    } catch (error: unknown) {
      // Обработка ошибки уникальности PostgreSQL
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === '23505' // unique_violation
      ) {
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
      .select({ count: sql<number>`count(*)` })
      .from(bookings)
      .where(eq(bookings.eventId, eventId));
    return Number(result[0]?.count ?? 0);
  }
}
