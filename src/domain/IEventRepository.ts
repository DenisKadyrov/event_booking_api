import { Event } from './Event.js';

export interface IEventRepository {
  create(event: Event): Promise<Event>;
  findById(id: number): Promise<Event | null>;
  listAll(): Promise<Event[]>;
}
