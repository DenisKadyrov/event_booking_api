# Event Booking API

REST API для управления событиями, пользователями и бронированием мест. Проект написан на TypeScript, использует Express, Drizzle ORM и Awilix для DI.

## Возможности
- Создание пользователей (`POST /api/users`)
- Создание событий (`POST /api/events`)
- Бронирование мест (`POST /api/bookings/reserve`)
- Swagger UI по адресу `/docs`

## Требования
- Node.js >= 18
- PostgreSQL 16+
- npm

## Локальный запуск
```bash
git clone https://github.com/DenisKadyrov/event_booking_api.git
cd event_booking_api
mv .env.example .env
npm install
npm run db:migrate
npm run dev
```
Переменную `DATABASE_URL` можно задать через `.env`:
```
DATABASE_URL=postgresql://booking_user:booking_pass@localhost:5432/booking_db
PORT=3000
NODE_ENV=development
```

## Запуск в Docker
```bash
docker compose up --build
```
После запуска:
- API: http://localhost:3000
- Swagger: http://localhost:3000/docs
- PostgreSQL: порт 5433 на хосте

## Тесты
```bash
npm test
```
Тесты используют Vitest и Supertest для проверки основных HTTP-эндпоинтов.

## Структура
- `src/application` — сервисы
- `src/domain` — доменные сущности и ошибки
- `src/interfaces/http` — Express-маршруты и middleware
- `src/infrastructure` — инфраструктурные абстракции, БД и DI