import type { Request, Response, NextFunction } from 'express';
import {
  AlreadyBookedError,
  DomainError,
  EventNotFoundError,
  InvalidInputError,
  SeatUnavailableError,
} from '../../../domain/errors.js';
import { logger } from '../../../infrastructure/logger/index.js';

function mapDomainErrorToStatus(error: DomainError): number {
  if (error instanceof InvalidInputError) {
    return 400;
  }
  if (error instanceof EventNotFoundError) {
    return 404;
  }
  if (error instanceof AlreadyBookedError) {
    return 409;
  }
  if (error instanceof SeatUnavailableError) {
    return 409;
  }
  return 400;
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof DomainError) {
    const status = mapDomainErrorToStatus(error);
    res.status(status).json({
      error: error.name,
      message: error.message,
    });
    return;
  }

  logger.error(
    {
      err: error,
    },
    'Unhandled error',
  );

  res.status(500).json({
    error: 'InternalServerError',
    message: 'Internal server error',
  });
}
