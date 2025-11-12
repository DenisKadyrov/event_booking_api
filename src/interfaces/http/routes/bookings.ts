import { Router } from 'express';
import { z, ZodError } from 'zod';
import type { BookingService } from '../../../application/services/BookingService.js';
import { InvalidInputError } from '../../../domain/errors.js';

const reserveSchema = z.object({
  event_id: z.coerce.number().int().positive(),
  user_id: z.string().min(1).max(255),
});

export function createBookingRouter(deps: { bookingService: BookingService }) {
  const router = Router();

  router.post('/reserve', async (req, res, next) => {
    try {
      const { event_id, user_id } = reserveSchema.parse(req.body);
      const booking = await deps.bookingService.reserveSeat({
        eventId: event_id,
        userId: user_id,
      });
      res.status(201).json({
        id: booking.id,
        event_id: booking.eventId,
        user_id: booking.userId,
        created_at: booking.createdAt.toISOString(),
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues.map((issue) => issue.message).join('; ');
        next(new InvalidInputError(message));
        return;
      }
      next(error);
    }
  });

  return router;
}
