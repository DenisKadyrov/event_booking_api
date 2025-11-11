/**
 * Booking Entity
 */
export class Booking {
  public readonly id: number;
  public readonly eventId: number;
  public readonly userId: string;
  public readonly createdAt: Date;

  constructor(eventId: number, userId: string, id?: number, createdAt?: Date) {
    this.id = id ?? 0;
    this.eventId = eventId;
    this.userId = userId;
    this.createdAt = createdAt ?? new Date();
  }
}
