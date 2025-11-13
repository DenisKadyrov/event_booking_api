/// <reference path="../src/types/testing.d.ts" />

import express from 'express';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import type { EventService } from '../src/application/services/EventService.js';
import { createEventRouter } from '../src/interfaces/http/routes/events.js';
import { errorHandler } from '../src/interfaces/http/middleware/errorHandler.js';

type EventServiceMock = Pick<EventService, 'createEvent'>;

describe('POST /api/events', () => {
  const buildApp = (eventService: EventServiceMock) => {
    const app = express();
    app.use(express.json());
    app.use(
      '/api/events',
      createEventRouter({ eventService: eventService as unknown as EventService }),
    );
    app.use(errorHandler);
    return app;
  };

  it('creates event successfully', async () => {
    const createEvent = vi.fn().mockResolvedValue({ id: 42, name: 'Conf', totalSeats: 150 });
    const eventService: EventServiceMock = {
      createEvent: createEvent as unknown as EventService['createEvent'],
    };
    const app = buildApp(eventService);

    const response = await request(app).post('/api/events').send({
      name: 'Conf',
      totalSeats: 150,
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: 42,
      name: 'Conf',
      total_seats: 150,
    });
    expect(createEvent).toHaveBeenCalledWith({
      name: 'Conf',
      totalSeats: 150,
    });
  });

  it('returns validation error for invalid payload', async () => {
    const createEvent = vi.fn();
    const eventService: EventServiceMock = {
      createEvent: createEvent as unknown as EventService['createEvent'],
    };
    const app = buildApp(eventService);

    const response = await request(app).post('/api/events').send({
      name: '',
      totalSeats: -1,
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('InvalidInputError');
    expect(createEvent).not.toHaveBeenCalled();
  });
});

