import { Router, type Request, type Response, type NextFunction } from 'express';
import { z, ZodError } from 'zod';
import type { BookingService } from '../../../application/services/BookingService.js';
import { InvalidInputError } from '../../../domain/errors.js';

const reserveSchema = z.object({
  event_id: z.coerce.number().int().positive(),
  user_id: z.string().min(1).max(255),
});

type ReserveRequestBody = z.infer<typeof reserveSchema>;

interface ReserveResponse {
  id: number;
  event_id: number;
  user_id: string;
  created_at: string;
}

export function createBookingRouter(deps: { bookingService: BookingService }) {
  const router = Router();

  router.post(
    '/reserve',
    async (req: Request, res: Response<ReserveResponse>, next: NextFunction) => {
      try {
        const body: ReserveRequestBody = reserveSchema.parse(req.body);
        const booking = await deps.bookingService.reserveSeat({
          eventId: body.event_id,
          userId: body.user_id,
        });
        const response: ReserveResponse = {
          id: booking.id,
          event_id: booking.eventId,
          user_id: booking.userId,
          created_at: booking.createdAt.toISOString(),
        };
        res.status(201).json(response);
      } catch (error: unknown) {
        if (error instanceof ZodError) {
          const message = error.issues.map((issue) => issue.message).join('; ');
          next(new InvalidInputError(message));
          return;
        }
        next(error);
      }
    },
  );

  return router;
}
