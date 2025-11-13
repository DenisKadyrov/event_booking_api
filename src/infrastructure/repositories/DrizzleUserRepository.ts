import type { IUserRepository } from '../../domain/IUserRepository.js';
import { User } from '../../domain/User.js';
import { users } from '../database/schema.js';
import { eq } from 'drizzle-orm';
import type { Database } from '../database/client.js';

export class DrizzleUserRepository implements IUserRepository {
  private readonly db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async create(user: User): Promise<User> {
    const rows = await this.db
      .insert(users)
      .values({
        id: user.id,
        name: user.name,
      })
      .returning();

    const row = rows[0];
    if (!row) {
      throw new Error('Failed to create user: no row returned');
    }

    return new User(row.id, row.name, row.createdAt ?? undefined);
  }

  async findById(id: string): Promise<User | null> {
    const rows = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    const row = rows[0];
    if (!row) {
      return null;
    }
    return new User(row.id, row.name, row.createdAt ?? undefined);
  }
}
