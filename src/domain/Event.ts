/**
 * Booking Entity
 */
export class Event {
  public readonly id: number;
  public readonly name: string;
  public readonly total_seats: number;

  constructor(
    id: number,
    name: string,
    total_seats: number,
  ) {
    this.id = id;
    this.name = name;
    this.total_seats = total_seats;
  }
}