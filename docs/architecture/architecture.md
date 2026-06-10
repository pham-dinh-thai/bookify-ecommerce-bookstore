# Architecture

Bookify is a full-stack ecommerce bookstore monorepo. It combines a Next.js
frontend, a NestJS API, MySQL persistence, Redis caching, local upload storage,
Nginx reverse proxying, and Docker Compose orchestration.

## Diagrams

- [System context diagram](./system-context-diagram.md)
- [Module dependency diagram](./module-dependency-diagram.md)

## Runtime Context

The system is exposed through Nginx on port 80. Nginx routes page requests and
Next.js assets to `frontend_app`, routes `/api` traffic to `backend_app`, and
serves uploaded files from the shared `/storage/uploads` volume under
`/uploads`.

The frontend lives under `frontend/src/app` and is split by user surface:

- `(shop)` for storefront, catalog browsing, cart, checkout, account, and order
  history.
- `(authentication)` for login, registration, verification, and account
  completion.
- `staff` for books, stock import, orders, dashboards, and sales statistics.
- `admin` for users, catalog metadata, roles, permissions, audit logs, and
  system overview.

Browser-side frontend calls use relative `/api/...` endpoints. Server-side
fetches can use `API_INTERNAL_URL` to call the backend container directly in
Docker, while `NEXT_PUBLIC_API_URL` is used for public API base selection.

The backend is a NestJS application with a global `/api` prefix. `main.ts`
configures cookie parsing, Helmet, validation with a global `ValidationPipe`,
and a global exception filter. `AppModule` wires platform modules
(`ConfigModule`, `TypeOrmModule`, cache, and CQRS) plus all business modules.

## Architectural Style

The backend follows a modular monolith style with Domain Driven Design and Clean
Architecture conventions. Business modules are organized around domain
capabilities rather than technical layers alone. Most feature modules follow
this shape:

- `presentation`: controllers and request DTOs.
- `application`: use cases, responses, and event handlers.
- `domain`: aggregates, entities, value objects, domain services, repository
  interfaces, read models, events, and exceptions.
- `infrastructure`: TypeORM entities, mappers, repository implementations, and
  adapters to external services.

Repository dependencies are inverted through domain interface tokens, while
TypeORM implementations are bound in Nest module providers. Shared technical
capabilities are exposed through shared modules such as unit of work, UUID,
cache, JWT, and event dispatcher.

## Backend Module Responsibilities

`AuthenticationModule` handles register, login, logout, refresh token, JWT
strategy wiring, token signing, refresh token hashing, cache usage, and user
registration events.

`AuthorizationModule` groups `RolesModule`, `PermissionsModule`, and
`RolePermissionModule`. These modules manage role and permission records,
role-permission grants, and authorization metadata used by guards.

`UserManagementModule` manages users for admin workflows, user activation
state, email uniqueness checks, and audit logging.

`CustomerManagementModule` manages customer profiles, addresses, contact data,
complete-information flow, phone number uniqueness, and customer queries.

`CatalogManagementModule` groups `GenresModule`, `AuthorsModule`,
`LanguagesModule`, and `PublishersModule`. These modules own catalog metadata
used by books and navigation.

`BookManagementModule` owns books, book covers, price changes, discounts, stock
adjustments, imports, shop collection queries, ISBN checks, and book validation.
It depends on catalog modules and `FileStorageModule`.

`CartManagementModule` owns per-user carts and cart items.

`OrderModule` owns customer order placement, my-orders queries, cancellation,
order details, stock checks through book dependencies, and order domain events.

`OrderManagementModule` owns staff order views, status transitions, and marking
orders as paid.

`PaymentGatewayModule` owns payment transaction persistence and payment
creation. It supports a mock flow and a MoMo gateway adapter.

`MyAccountModule` composes user and customer capabilities for self-service
profile, contact, password, email, and address operations.

`DashboardModule` composes read models from orders, books, users, customers,
catalog metadata, and audit logs for admin, staff, and shop navigation views.

`SalesStatisticsModule` reads order and order-item data for monthly, quarterly,
and yearly sales reporting.

`AuditLogModule` stores and queries audit logs for operational visibility.

`EmailModule` registers domain event handlers and sends transactional emails for
registration verification and order lifecycle events through Resend.

`FileStorageModule` stores uploaded files in `/storage/uploads` and returns
public `/uploads/...` URLs served by Nginx.

## Shared Services

`UnitOfWorkModule` exposes a TypeORM-backed unit of work for transactional use
cases.

`UuidModule` exposes UUID generation, currently using a UUID v7 generator.

`SharedCacheModule` exposes a Redis-backed cache repository using `ioredis`.
`AppModule` also configures Nest cache manager with a Keyv Redis store.

`SharedJwtModule` exposes a shared JWT service used outside the authentication
module.

`EventDispatcherModule` exposes an in-process event dispatcher. The order and
authentication modules publish events; the email module subscribes to them on
module initialization.

## Data and External Integrations

MySQL is the source of truth for users, customers, catalog data, books, carts,
orders, payments, audit logs, and related records through TypeORM entities.

Redis is used for shared cache behavior and token/session-adjacent state. Cache
TTL is configurable through environment variables and defaults in the backend
configuration.

Uploaded files are written by the backend to `/storage/uploads`, mounted from
`./storage/uploads` in Docker Compose, and served read-only by Nginx.

Transactional email is sent through Resend. Development can redirect all email
to a configured inbox through `EMAIL_DELIVERY_MODE=dev-inbox`.

Payment creation uses the MoMo test gateway when the provider flow is used, and
the application also includes mock payment endpoints for local checkout flows.

The frontend calls `https://provinces.open-api.vn` directly for province and
district address lookup.

## Dependency Notes

The module dependency diagram is a practical map of Nest module imports. It is
not a strict acyclic domain dependency graph. Some infrastructure-level imports,
especially `AuditLogModule` importing `AuthenticationModule` while many modules
also import `AuditLogModule`, create cycles at the Nest module wiring level.
Those cycles are part of the current implementation and should be considered
when refactoring shared guards, audit logging, or identity concerns.

New feature work should prefer existing module boundaries and shared provider
tokens. Cross-module access should go through exported repository interfaces,
use cases, or well-defined domain services instead of reaching into another
module's infrastructure implementation directly.

## Deployment Shape

The default Docker Compose stack runs:

- `nginx` on host port 80.
- `frontend_app` on container port 3000.
- `backend_app` on container port 3000 with `/api` global prefix.
- `mysql_db` on MySQL 8.0.
- `redis_cache` on Redis.
- `redis-insight` for cache inspection.

Production Compose and Dockerfiles are present separately, but the runtime
shape remains the same: Nginx fronts the frontend, backend API, and upload
assets; the backend owns business logic and persistence access.
