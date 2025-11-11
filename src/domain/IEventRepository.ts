import { Event } from "./Event.js";

export interface IEventRepository {
  findById(id: number): Promise<Event | null>;
  listAll(): Promise<Event[]>;
}