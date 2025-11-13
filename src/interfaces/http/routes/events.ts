import { Router, type Request, type Response, type NextFunction } from 'express';
import { z, ZodError } from 'zod';
import type { EventService } from '../../../application/services/EventService.js';
import { InvalidInputError } from '../../../domain/errors.js';

const createEventSchema = z.object({
  name: z.string().min(1).max(255),
  totalSeats: z.coerce.number().int().positive(),
});

type CreateEventRequestBody = z.infer<typeof createEventSchema>;

interface CreateEventResponse {
  id: number;
  name: string;
  total_seats: number;
}

export function createEventRouter(deps: { eventService: EventService }) {
  const router = Router();

  /**
   * @openapi
   * /api/events:
   *   post:
   *     summary: Создать событие
   *     tags:
   *       - Events
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - totalSeats
   *             properties:
   *               name:
   *                 type: string
   *                 example: "Tech Conference"
   *               totalSeats:
   *                 type: integer
   *                 example: 100
   *     responses:
   *       201:
   *         description: Событие успешно создано
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                 name:
   *                   type: string
   *                 total_seats:
   *                   type: integer
   *       400:
   *         description: Некорректные данные
   */
  router.post('/', async (req: Request, res: Response<CreateEventResponse>, next: NextFunction) => {
    try {
      const body: CreateEventRequestBody = createEventSchema.parse(req.body);
      const event = await deps.eventService.createEvent({
        name: body.name,
        totalSeats: body.totalSeats,
      });

      const response: CreateEventResponse = {
        id: event.id,
        name: event.name,
        total_seats: event.totalSeats,
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
  });

  return router;
}
