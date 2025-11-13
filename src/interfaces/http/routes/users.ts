import { Router, type Request, type Response, type NextFunction } from 'express';
import { z, ZodError } from 'zod';
import type { UserService } from '../../../application/services/UserService.js';
import { InvalidInputError } from '../../../domain/errors.js';

const createUserSchema = z.object({
  id: z.string().min(1).max(255),
  name: z.string().min(1).max(255),
});

type CreateUserRequestBody = z.infer<typeof createUserSchema>;

interface CreateUserResponse {
  id: string;
  name: string;
  created_at: string;
}

export function createUserRouter(deps: { userService: UserService }) {
  const router = Router();

  /**
   * @openapi
   * /api/users:
   *   post:
   *     summary: Создать пользователя
   *     tags:
   *       - Users
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - id
   *               - name
   *             properties:
   *               id:
   *                 type: string
   *                 example: "user-123"
   *               name:
   *                 type: string
   *                 example: "Ivan Ivanov"
   *     responses:
   *       201:
   *         description: Пользователь успешно создан
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                 name:
   *                   type: string
   *                 created_at:
   *                   type: string
   *                   format: date-time
   *       400:
   *         description: Некорректные данные
   */
  router.post('/', async (req: Request, res: Response<CreateUserResponse>, next: NextFunction) => {
    try {
      const body: CreateUserRequestBody = createUserSchema.parse(req.body);
      const user = await deps.userService.createUser({
        id: body.id,
        name: body.name,
      });

      const response: CreateUserResponse = {
        id: user.id,
        name: user.name,
        created_at: (user.createdAt ?? new Date()).toISOString(),
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
