# Bookify Ecommerce Bookstore

Bookify is an ecommerce bookstore application built as a full-stack monorepo. It includes a NestJS API, a Next.js storefront/admin interface, MySQL persistence, Redis caching, Nginx reverse proxying, and Docker-based local orchestration.

![Homepage](docs/images/homepage.png)

## Highlighted Features

- **Customer storefront:** Browse best sellers, new arrivals, on-sale books, genre collections, product details, cart, checkout, mock/VNPay payment, and customer order history.
- **AI customer support chatbot:** A floating chat widget available on every shop page, powered by an LLM (Groq).
- **Authentication:** Email/password login, JWT refresh sessions, Google OAuth login, and profile completion for newly created OAuth users.
- **Popularity-aware navigation:** Homepage category cards and navbar genre links prioritize the most popular genres from recent sales, with catalog fallback when sales data is not available.
- **Staff operations:** Staff can manage books, import stock, handle orders, inspect customer records, and monitor operational dashboard metrics.
- **Sales statistics:** Staff reporting supports monthly, quarterly, and yearly filters from the reporting start period, using real order and order item aggregates for revenue, orders, books sold, average order value, payment channels, category revenue, and top-selling books.
- **Admin management:** Admin pages cover users, genres, publishers, authors, languages, roles, permissions, and system overview metrics.
- **Order lifecycle:** Orders support placement, confirmation, delivery progress, completion, cancellation, payment status tracking, audit logging, and transactional email notifications.
- **Email notifications:** Automated email delivery via Resend for account verification (OTP) and order lifecycle events (confirmation, delivery, completion, cancellation).
- **Payments:** Mock payment for local development plus real VNPay sandbox integration with retry support and payment status tracking.

## Tech Stack

- **Backend:** NestJS, TypeScript, TypeORM, JWT authentication, Passport Google OAuth
- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Database:** MySQL 8.0
- **Cache:** Redis
- **AI:** Groq (LLM API, OpenAI-compatible), Server-Sent Events streaming
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
|   |   |   |-- chatbot/
|   |   |   |-- customer-management/
|   |   |   |-- dashboard/
|   |   |   |-- email/
|   |   |   |-- file-storage/
|   |   |   |-- my-account/
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

FRONTEND_URL=http://localhost

VNPAY_TMN_CODE=your_vnpay_tmn_code
VNPAY_HASH_SECRET=your_vnpay_hash_secret
VNPAY_ENDPOINT=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost/api/payment/vnpay/return
MOCK_PAYMENT_URL=http://localhost/payment/mock

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost/api/auth/google/callback

GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
```

```env
# frontend/.env
NEXT_PUBLIC_API_URL=/api
API_INTERNAL_URL=http://backend_app:3000/api
NEXT_PUBLIC_APP_URL=http://localhost
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
# backend/.env
FRONTEND_URL=http://localhost:3000
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
VNPAY_RETURN_URL=http://localhost:3001/api/payment/vnpay/return

# frontend/.env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
API_INTERNAL_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

For Google OAuth, register the matching callback URL in Google Cloud Console. In Docker/Nginx development the redirect URI is usually `http://localhost/api/auth/google/callback`; in local backend development on port `3001`, use `http://localhost:3001/api/auth/google/callback`.

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
- `chatbot`
- `customer-management`
- `dashboard`
- `email`
- `file-storage`
- `my-account`
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

## AI Chatbot

The `chatbot` module powers the floating chat widget available across shop pages. It combines a live catalog search tool with a Retrieval-Augmented Generation (RAG) knowledge base.

AI configuration in `backend/.env`:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
```

How it works:

- **Guest access:** Unauthenticated visitors get an anonymous `x-guest-id` (persisted in `localStorage`). The backend uses an optional JWT guard — real users are identified by JWT, guests by guest ID. Admin-only knowledge endpoints stay protected.
- **Catalog grounding:** User queries are classified by intent (bestsellers, new arrivals, normal search), then matched against the real product database (title, author, ISBN). Only matched products are injected into the system prompt as context, so the AI never invents books.
- **RAG:** Admins manage knowledge sources (store policies, FAQs) which are chunked, embedded, and retrieved as context for customer questions.
- **Streaming:** `POST /sessions/:id/messages/stream` returns a Server-Sent Events response that Nginx is configured to proxy without buffering.
- **Safety:** A strict system prompt keeps the assistant on-topic, blocks off-topic requests, and refuses prompt-injection attempts.

Chat sessions are scoped per user/guest: sessions, messages, and history are isolated by identity. The frontend renders markdown (bold, italic, lists) and provides localized suggested questions.

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
