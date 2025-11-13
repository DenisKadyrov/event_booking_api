export class Event {
  public readonly id: number;
  public readonly name: string;
  public readonly totalSeats: number;

  constructor(name: string, totalSeats: number, id?: number) {
    this.id = id ?? 0;
    this.name = name;
    this.totalSeats = totalSeats;
  }
}
