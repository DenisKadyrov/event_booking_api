/// <reference path="../src/types/testing.d.ts" />

import express from 'express';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import type { UserService } from '../src/application/services/UserService.js';
import { createUserRouter } from '../src/interfaces/http/routes/users.js';
import { errorHandler } from '../src/interfaces/http/middleware/errorHandler.js';

type UserServiceMock = Pick<UserService, 'createUser'>;

describe('POST /api/users', () => {
  const buildApp = (userService: UserServiceMock) => {
    const app = express();
    app.use(express.json());
    app.use(
      '/api/users',
      createUserRouter({ userService: userService as unknown as UserService }),
    );
    app.use(errorHandler);
    return app;
  };

  it('creates user successfully', async () => {
    const createUser = vi.fn().mockResolvedValue({
      id: 'user-123',
      name: 'Alice',
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
    });
    const userService: UserServiceMock = {
      createUser: createUser as unknown as UserService['createUser'],
    };
    const app = buildApp(userService);

    const response = await request(app).post('/api/users').send({
      id: 'user-123',
      name: 'Alice',
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: 'user-123',
      name: 'Alice',
      created_at: '2024-01-01T00:00:00.000Z',
    });
    expect(createUser).toHaveBeenCalledWith({
      id: 'user-123',
      name: 'Alice',
    });
  });

  it('returns validation error for invalid payload', async () => {
    const createUser = vi.fn();
    const userService: UserServiceMock = {
      createUser: createUser as unknown as UserService['createUser'],
    };
    const app = buildApp(userService);

    const response = await request(app).post('/api/users').send({
      id: '',
      name: '',
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('InvalidInputError');
    expect(createUser).not.toHaveBeenCalled();
  });
});

