import { Event } from '../../domain/Event.js';
import type { IEventRepository } from '../../domain/IEventRepository.js';
import { InvalidInputError } from '../../domain/errors.js';

export interface CreateEventInput {
  name: string;
  totalSeats: number;
}

export class EventService {
  private readonly eventRepository: IEventRepository;

  constructor({ eventRepository }: { eventRepository: IEventRepository }) {
    this.eventRepository = eventRepository;
  }

  async createEvent({ name, totalSeats }: CreateEventInput): Promise<Event> {
    const trimmedName = name.trim();
    if (!trimmedName) {
      throw new InvalidInputError('Event name must not be empty');
    }

    if (!Number.isInteger(totalSeats) || totalSeats <= 0) {
      throw new InvalidInputError('Total seats must be a positive integer');
    }

    const event = new Event(trimmedName, totalSeats);
    return this.eventRepository.create(event);
  }
}
