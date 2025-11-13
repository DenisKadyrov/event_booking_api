import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

export function setupSwagger(app: Express) {
  const options = {
    definition: {
      openapi: '3.0.3',
      info: {
        title: 'Booking API',
        version: '1.0.0',
        description: 'API для бронирования мест на события',
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Local server',
        },
      ],
    },
    apis: ['./src/interfaces/http/routes/*.ts'],
  };

  const specs = swaggerJsdoc(options);
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
}
