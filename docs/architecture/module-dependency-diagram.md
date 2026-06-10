# Module Dependency Diagram

This page splits module dependencies into smaller diagrams so the relationships
are readable. `AppModule` imports every business module, so the detailed
diagrams below focus on the dependencies that matter for understanding feature
coupling.

## 1. High-Level Composition

```mermaid
flowchart LR
  App["AppModule"]

  Platform["Platform\nConfig, TypeORM, Cache, CQRS"]
  Shared["Shared modules\nUnit of work, UUID, cache, JWT, events"]
  Identity["Identity and access\nAuth, authorization, users, customers"]
  Catalog["Catalog and inventory\nCatalog metadata, books, files"]
  Commerce["Commerce\nCart, orders, payments"]
  Operations["Operations\nDashboard, statistics, audit, email"]

  App --> Platform
  App --> Shared
  App --> Identity
  App --> Catalog
  App --> Commerce
  App --> Operations

  Identity --> Shared
  Catalog --> Identity
  Catalog --> Shared
  Commerce --> Identity
  Commerce --> Catalog
  Commerce --> Shared
  Operations --> Identity
  Operations --> Catalog
  Operations --> Commerce
  Operations --> Shared
```

## 2. Shared Module Usage

Most modules share the same technical dependencies. These are omitted from the
feature diagrams unless they are central to the relationship.

```mermaid
flowchart LR
  UnitOfWork["UnitOfWorkModule"]
  Uuid["UuidModule"]
  SharedCache["SharedCacheModule"]
  SharedJwt["SharedJwtModule"]
  EventDispatcher["EventDispatcherModule"]

  FeatureModules["Feature modules\nuse cases and repositories"]
  Auth["AuthenticationModule"]
  Order["OrderModule"]
  Email["EmailModule"]

  FeatureModules --> UnitOfWork
  FeatureModules --> Uuid
  FeatureModules --> SharedCache
  Auth --> SharedJwt
  Auth --> EventDispatcher
  Order --> EventDispatcher
  Email --> EventDispatcher

```

## 3. Identity And Access

```mermaid
flowchart LR
  Authentication["AuthenticationModule"]
  Authorization["AuthorizationModule"]
  Roles["RolesModule"]
  Permissions["PermissionsModule"]
  RolePermission["RolePermissionModule"]
  UserManagement["UserManagementModule"]
  CustomerManagement["CustomerManagementModule"]
  MyAccount["MyAccountModule"]
  AuditLog["AuditLogModule"]

  Authorization --> Roles
  Authorization --> Permissions

  Roles --> Permissions
  Roles --> RolePermission
  Roles --> Authentication
  Roles --> AuditLog

  Permissions --> RolePermission
  Permissions --> Authentication
  Permissions --> AuditLog

  UserManagement --> Roles
  UserManagement --> Authentication
  UserManagement --> AuditLog

  CustomerManagement --> UserManagement
  CustomerManagement --> Authentication
  CustomerManagement --> AuditLog

  MyAccount --> UserManagement
  MyAccount --> CustomerManagement
  MyAccount --> Authentication
  MyAccount --> AuditLog

  AuditLog --> Authentication
```

## 4. Catalog And Inventory

```mermaid
flowchart LR
  CatalogManagement["CatalogManagementModule"]
  Genres["GenresModule"]
  Authors["AuthorsModule"]
  Languages["LanguagesModule"]
  Publishers["PublishersModule"]
  BookManagement["BookManagementModule"]
  FileStorage["FileStorageModule"]
  Authentication["AuthenticationModule"]
  Roles["RolesModule"]
  AuditLog["AuditLogModule"]

  CatalogManagement --> Genres
  CatalogManagement --> Authors
  CatalogManagement --> Languages
  CatalogManagement --> Publishers

  Genres --> Roles
  Genres --> Authentication
  Genres --> AuditLog

  Authors --> Authentication
  Authors --> AuditLog
  Languages --> Authentication
  Languages --> AuditLog
  Publishers --> Authentication
  Publishers --> AuditLog

  BookManagement --> Genres
  BookManagement --> Authors
  BookManagement --> Languages
  BookManagement --> Publishers
  BookManagement --> FileStorage
  BookManagement --> Authentication
  BookManagement --> AuditLog
```

## 5. Commerce And Operations

```mermaid
flowchart LR
  Authentication["AuthenticationModule"]
  CustomerManagement["CustomerManagementModule"]
  BookManagement["BookManagementModule"]
  Order["OrderModule"]
  CartManagement["CartManagementModule"]
  OrderManagement["OrderManagementModule"]
  PaymentGateway["PaymentGatewayModule"]
  Dashboard["DashboardModule"]
  SalesStatistics["SalesStatisticsModule"]
  AuditLog["AuditLogModule"]
  Email["EmailModule"]
  EventDispatcher["EventDispatcherModule"]
  CatalogMetadata["Catalog metadata modules"]

  CartManagement --> Authentication

  Order --> Authentication
  Order --> CustomerManagement
  Order --> BookManagement
  Order --> AuditLog
  Order --> EventDispatcher

  OrderManagement --> Authentication
  OrderManagement --> Order
  OrderManagement --> CustomerManagement
  OrderManagement --> AuditLog
  OrderManagement --> EventDispatcher

  PaymentGateway --> Order

  Dashboard --> Authentication
  Dashboard --> Order
  Dashboard --> BookManagement
  Dashboard --> CustomerManagement
  Dashboard --> CatalogMetadata
  Dashboard --> AuditLog

  SalesStatistics --> Authentication
  SalesStatistics --> Order

  Email --> Authentication
  Email --> EventDispatcher
  Email --> Order
```

## Notes

- Arrows mean "imports or depends on exported providers from".
- The diagrams hide direct `TypeOrmModule.forFeature(...)` imports because those
  are persistence wiring, not feature-to-feature dependencies.
- `AuditLogModule` imports `AuthenticationModule`, while many feature modules
  also import `AuditLogModule`. That is a real Nest module wiring cycle in the
  current implementation, so identity and audit concerns should be handled with
  care during refactors.
