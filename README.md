# Bookify Ecommerce Bookstore

Bookify is an ecommerce bookstore application built as a full-stack monorepo. It includes a NestJS API, a Next.js storefront/admin interface, MySQL persistence, Redis caching, Nginx reverse proxying, and Docker-based local orchestration.

## Tech Stack

- **Architecture:** Domain Driven Design, Clean Architecture, Modular Monolith
- **Backend:** NestJS, TypeScript, TypeORM, CQRS, JWT authentication
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
|   |   |   |-- file-storage/
|   |   |   |-- order/
|   |   |   |-- order-management/
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
- `file-storage`
- `order`
- `order-management`
- `user-management`
- `audit-log`

## Frontend Areas

The frontend is organized by application area:

- Authentication pages and components
- Customer-facing shop pages
- Checkout and customer order pages
- Admin management pages
- Staff operational pages
- Shared auth and common UI utilities

## Key Workflows

### Customer Shopping And Orders

- Browse books and add selected books to the cart.
- Use `Buy now` from a book detail page to start checkout immediately.
- Use `Proceed to Checkout` from the cart with selected items.
- Confirm checkout information on `/checkout`, including:
  - Read-only phone number loaded from account contact information
  - Saved shipping address or a custom shipping address
  - Payment method
  - Order summary with quantity, unit price, line total, and total amount
- Place orders through `POST /api/my-orders`.
- View orders on `/account/orders` with status tabs:
  - All
  - Pending
  - Confirmed
  - Delivering
  - Delivered
  - Completed
  - Canceled
  - Refunded
- View customer order details on `/account/orders/[id]`.
- Cancel customer orders while they are still in a cancellable status.

### Staff Order Management

- View all orders from `/staff/orders`.
- Search and paginate orders through the backend.
- View staff order details on `/staff/orders/[id]`.
- Move order status through the fulfillment lifecycle:
  - Pending
  - Confirmed
  - Delivering
  - Delivered
  - Completed
- Mark an order as paid, including cash-on-delivery orders after staff confirms payment.
- The order domain prevents completing an order until its payment status is `paid`.

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
