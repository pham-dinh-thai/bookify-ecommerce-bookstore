# Bookify Ecommerce Bookstore

Bookify is an ecommerce bookstore application built as a full-stack monorepo. It includes a NestJS API, a Next.js storefront/admin interface, MySQL persistence, Redis caching, Nginx reverse proxying, and Docker-based local orchestration.

![Homepage](docs/images/homepage.png)

## Highlighted Features

- **Customer storefront:** Browse best sellers, new arrivals, on-sale books, genre collections, product details, cart, checkout, mock payment, and customer order history.
- **Popularity-aware navigation:** Homepage category cards and navbar genre links prioritize the most popular genres from recent sales, with catalog fallback when sales data is not available.
- **Staff operations:** Staff can manage books, import stock, handle orders, inspect customer records, and monitor operational dashboard metrics.
- **Sales statistics:** Staff reporting supports monthly, quarterly, and yearly filters from the reporting start period, using real order and order item aggregates for revenue, orders, books sold, average order value, payment channels, category revenue, and top-selling books.
- **Admin management:** Admin pages cover users, genres, publishers, authors, languages, roles, permissions, and system overview metrics.
- **Order lifecycle:** Orders support placement, confirmation, delivery progress, completion, cancellation, payment status tracking, audit logging, and transactional email notifications.
- **Seed data:** Database seeds include roles, permissions, catalog data, admin/staff accounts, plus realistic Vietnamese customer and staff users with customer profiles and default addresses for development testing.

## Tech Stack

- **Backend:** NestJS, TypeScript, TypeORM, JWT authentication
- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Database:** MySQL 8.0
- **Cache:** Redis
- **Web server:** Nginx
- **Containerization:** Docker, Docker Compose
- **Package manager:** pnpm

## Project Structure

```text
.
|-- backend/                 # NestJS API
|   |-- src/
|   |   |-- modules/         # Business modules
|   |   |   |-- authentication/
|   |   |   |-- authorization/
|   |   |   |-- book-management/
|   |   |   |-- cart-management/
|   |   |   |-- catalog-management/
|   |   |   |-- customer-management/
|   |   |   |-- dashboard/
|   |   |   |-- email/
|   |   |   |-- file-storage/
|   |   |   |-- order/
|   |   |   |-- order-management/
|   |   |   |-- payment-gateway/
|   |   |   |-- sales-statistics/
|   |   |   |-- user-management/
|   |   |   `-- audit-log/
|   |   `-- shared/          # Shared domain, HTTP, infrastructure, and modules
|   |-- Dockerfile
|   `-- package.json
|-- frontend/                # Next.js application
|   |-- src/app/
|   |   |-- (authentication)/
|   |   |-- (shop)/
|   |   |-- admin/
|   |   `-- staff/
|   |-- Dockerfile
|   `-- package.json
|-- nginx/
|   `-- nginx.conf           # Reverse proxy and static upload serving
|-- storage/uploads/         # Uploaded files mounted into backend and Nginx
|-- docker-compose.yaml
|-- .env.example
|-- backend/.env.example
`-- frontend/.env.example
```

## Prerequisites

For Docker-based development:

- Docker Engine or Docker Desktop
- Docker Compose

For local development without Docker:

- Node.js 22+
- pnpm 9.15.4+
- MySQL 8.0
- Redis

## Environment Setup

Create environment files from the examples:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

For Docker Compose, use service names inside container-facing environment files:

```env
# .env
MYSQL_HOST=mysql_db
MYSQL_USER=bookify
MYSQL_PASSWORD=bookify_password
MYSQL_DATABASE=bookify
MYSQL_PORT=3306

REDIS_HOST=redis_cache
REDIS_PORT=6379
```

```env
# backend/.env
NODE_ENV=development

MYSQL_HOST=mysql_db
MYSQL_USER=bookify
MYSQL_PASSWORD=bookify_password
MYSQL_DATABASE=bookify
MYSQL_PORT=3306

REDIS_HOST=redis_cache
REDIS_PORT=6379

JWT_SECRET=change_this_access_token_secret
TEMP_TOKEN_SECRET=change_this_temp_token_secret
JWT_REFRESH_SECRET=change_this_refresh_token_secret

RESEND_API_KEY=your_resend_api_key
EMAIL_DELIVERY_MODE=dev-inbox
DEV_EMAIL_INBOX=your_resend_account_email
EMAIL_FROM=onboarding@resend.dev
EMAIL_REPLY_TO=onboarding@resend.dev
```

```env
# frontend/.env
NEXT_PUBLIC_API_URL=/api
API_INTERNAL_URL=http://backend_app:3000/api
```

For local development without Docker, replace `mysql_db`, `redis_cache`, and `backend_app` with localhost-based addresses that match your running services.

## Run With Docker Compose

Build and start the full stack:

```bash
docker compose up --build
```

Default services:

- Frontend: http://localhost
- Backend API: http://localhost/api
- MySQL: localhost:3306
- Redis: localhost:6379
- RedisInsight: http://localhost:8001

Stop the stack:

```bash
docker compose down
```

Stop the stack and remove named volumes:

```bash
docker compose down -v
```

## Run Locally

Start MySQL and Redis first, then configure `backend/.env` and `frontend/.env` for local addresses.

Install and run the backend:

```bash
cd backend
corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm install
PORT=3001 pnpm start:dev
```

Install and run the frontend:

```bash
cd frontend
corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm install
pnpm dev
```

When running the backend locally on port `3001`, set:

```env
# frontend/.env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
API_INTERNAL_URL=http://localhost:3001/api
```

Then open http://localhost:3000.

## Scripts

Backend scripts:

```bash
cd backend
pnpm start:dev    # Start API in watch mode
pnpm build        # Build production output
pnpm start:prod   # Run compiled production output
pnpm lint         # Lint and fix
pnpm test         # Run unit tests
pnpm test:e2e     # Run e2e tests
pnpm test:cov     # Run tests with coverage
```

Frontend scripts:

```bash
cd frontend
pnpm dev          # Start Next.js development server
pnpm build        # Build production output
pnpm start        # Run production server
pnpm lint         # Run ESLint
```

## Backend Modules

The backend follows a modular structure. Each business module is organized around clean boundaries such as `domain`, `application`, `infrastructure`, and `presentation`.

Main modules:

- `authentication`
- `authorization`
- `book-management`
- `cart-management`
- `catalog-management`
- `customer-management`
- `dashboard`
- `email`
- `file-storage`
- `order`
- `order-management`
- `payment-gateway`
- `sales-statistics`
- `user-management`
- `audit-log`

## Email Notifications

The backend uses the `email` module and the configured email sender to send transactional email from domain events.

Email delivery is configured in `backend/.env`:

```env
RESEND_API_KEY=your_resend_api_key
EMAIL_DELIVERY_MODE=dev-inbox
DEV_EMAIL_INBOX=your_resend_account_email
EMAIL_FROM=onboarding@resend.dev
EMAIL_REPLY_TO=onboarding@resend.dev
```

Supported delivery modes:

- `resend`: send email directly to the real recipient through Resend.
- `dev-inbox`: redirect all outgoing email to `DEV_EMAIL_INBOX`.
- `log`: do not send email; log the email payload instead.

Order lifecycle emails:

- `OrderPlaced`: sent when a customer places an order.
- `OrderConfirmed`: sent when staff confirms a pending order.
- `OrderDeliveryStarted`: sent when staff starts delivery.
- `OrderDelivered`: sent when staff marks the order as delivered.
- `OrderCompleted`: sent when staff completes the order.
- `OrderCanceled`: sent when a customer cancels their order.

Order emails are dispatched only after the related order transaction succeeds.

## Frontend Areas

The frontend is organized by application area:

- Authentication pages and components
- Customer-facing shop pages
- Checkout and customer order pages
- Admin management pages
- Staff operational pages
- Shared auth and common UI utilities

## Nginx Routing

Nginx is the public entry point in Docker Compose:

- `/` proxies to the Next.js frontend
- `/api` proxies to the NestJS backend
- `/uploads/` serves uploaded files from `storage/uploads`
- `/_next/` proxies Next.js assets without caching in development

## Notes

- Uploaded files are stored under `storage/uploads` and mounted into both backend and Nginx.
- MySQL, Redis, RedisInsight, backend `node_modules`, frontend `node_modules`, and Next.js cache use Docker named volumes.
- The backend API listens on port `3000` by default unless `PORT` is provided.
