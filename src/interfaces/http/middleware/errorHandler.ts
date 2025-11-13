import type { Request, Response, NextFunction } from 'express';
import {
  AlreadyBookedError,
  DomainError,
  EventNotFoundError,
  InvalidInputError,
  SeatUnavailableError,
} from '../../../domain/errors.js';
import { logger } from '../../../infrastructure/logger/index.js';

interface ErrorResponse {
  error: string;
  message: string;
}

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

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response<ErrorResponse>,
  _next: NextFunction,
): void {
  if (error instanceof DomainError) {
    const status = mapDomainErrorToStatus(error);
    const response: ErrorResponse = {
      error: error.name,
      message: error.message,
    };
    res.status(status).json(response);
    return;
  }

  logger.error(
    {
      err: error,
    },
    'Unhandled error',
  );

  const response: ErrorResponse = {
    error: 'InternalServerError',
    message: 'Internal server error',
  };
  res.status(500).json(response);
}
