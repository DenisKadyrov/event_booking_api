export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class InvalidInputError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class EventNotFoundError extends DomainError {
  constructor(eventId: number) {
    super(`Event with id ${eventId} not found`);
  }
}

export class SeatUnavailableError extends DomainError {
  constructor(eventId: number) {
    super(`Event with id ${eventId} has no available seats`);
  }
}

export class AlreadyBookedError extends DomainError {
  constructor(userId: string, eventId: number) {
    super(`User ${userId} already has a booking for event ${eventId}`);
  }
}
