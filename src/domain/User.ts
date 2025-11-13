export class User {
  public readonly id: string;
  public readonly name: string;
  public readonly createdAt?: Date;

  constructor(id: string, name: string, createdAt?: Date) {
    this.id = id;
    this.name = name;
    this.createdAt = createdAt;
  }
}
