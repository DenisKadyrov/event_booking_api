import type { IEventRepository } from '../../domain/IEventRepository.js';
import { Event } from '../../domain/Event.js';
import { events } from '../database/schema.js';
import { eq } from 'drizzle-orm';
import type { Database } from '../database/client.js';

export class DrizzleEventRepository implements IEventRepository {
  private readonly db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async create(event: Event): Promise<Event> {
    const rows = await this.db
      .insert(events)
      .values({
        name: event.name,
        totalSeats: event.totalSeats,
      })
      .returning();
    const row = rows[0];
    if (!row) {
      throw new Error('Failed to create event: no row returned');
    }
    return new Event(row.name, row.totalSeats, row.id);
  }
  async findById(id: number): Promise<Event | null> {
    const rows = await this.db.select().from(events).where(eq(events.id, id)).limit(1);
    const row = rows[0];
    if (!row) return null;
    return new Event(row.name, row.totalSeats, row.id);
  }

  async listAll(): Promise<Event[]> {
    const rows = await this.db.select().from(events);
    return rows.map((r) => new Event(r.name, r.totalSeats, r.id));
  }
}
