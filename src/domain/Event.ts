/**
 * Booking Entity
 */
export class Event {
  public readonly id: number;
  public readonly name: string;
  public readonly totalSeats: number;

  constructor(id: number, name: string, totalSeats: number) {
    this.id = id;
    this.name = name;
    this.totalSeats = totalSeats;
  }
}
