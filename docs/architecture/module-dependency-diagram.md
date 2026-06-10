# Module Dependency Diagram

This diagram is about feature folders under `backend/src/modules/*`, not NestJS
`SomethingModule` classes. Arrows mean the source folder imports code from the
target folder.

Scope used for this diagram:

- Included: TypeScript imports inside `backend/src/modules/*`.
- Excluded: `*.module.ts` Nest wiring files and `*.spec.ts` tests.
- Excluded: shared technical modules under `backend/src/shared`.

## 1. Module Groups

```mermaid
flowchart LR
  subgraph Identity["identity"]
    authentication["authentication"]
    authorization["authorization"]
    userManagement["user-management"]
    customerManagement["customer-management"]
    myAccount["my-account"]
  end

  subgraph Catalog["catalog and inventory"]
    catalogManagement["catalog-management"]
    bookManagement["book-management"]
    fileStorage["file-storage"]
    cartManagement["cart-management"]
  end

  subgraph Commerce["commerce"]
    order["order"]
    orderManagement["order-management"]
    paymentGateway["payment-gateway"]
  end

  subgraph Operations["operations"]
    auditLog["audit-log"]
    dashboard["dashboard"]
    salesStatistics["sales-statistics"]
    email["email"]
  end

  customerManagement --> userManagement
  myAccount --> userManagement
  myAccount --> customerManagement
  userManagement --> authorization

  bookManagement --> catalogManagement
  bookManagement --> fileStorage
  cartManagement --> bookManagement
  order --> bookManagement
  order --> customerManagement

  orderManagement --> order
  paymentGateway --> order
  salesStatistics --> order
  dashboard --> order
  dashboard --> bookManagement
  email --> order

  authorization --> auditLog
  userManagement --> auditLog
  customerManagement --> auditLog
  catalogManagement --> auditLog
  bookManagement --> auditLog
  order --> auditLog
  orderManagement --> auditLog
  myAccount --> auditLog
```

## 2. Identity Dependencies

```mermaid
flowchart LR
  authentication["authentication"]
  authorization["authorization"]
  userManagement["user-management"]
  customerManagement["customer-management"]
  myAccount["my-account"]
  auditLog["audit-log"]

  authentication --> userManagement

  userManagement --> authorization
  userManagement --> auditLog

  customerManagement --> userManagement
  customerManagement --> auditLog

  myAccount --> userManagement
  myAccount --> customerManagement
  myAccount --> auditLog

  authorization --> auditLog
```

## 3. Catalog And Inventory Dependencies

```mermaid
flowchart LR
  catalogManagement["catalog-management"]
  bookManagement["book-management"]
  fileStorage["file-storage"]
  cartManagement["cart-management"]
  userManagement["user-management"]
  auditLog["audit-log"]
  order["order"]

  catalogManagement --> auditLog
  catalogManagement --> bookManagement

  bookManagement --> catalogManagement
  bookManagement --> fileStorage
  bookManagement --> auditLog
  bookManagement --> order

  cartManagement --> bookManagement
  cartManagement --> userManagement
```

## 4. Commerce Dependencies

```mermaid
flowchart LR
  order["order"]
  orderManagement["order-management"]
  paymentGateway["payment-gateway"]
  bookManagement["book-management"]
  customerManagement["customer-management"]
  userManagement["user-management"]
  auditLog["audit-log"]
  dashboard["dashboard"]

  order --> bookManagement
  order --> customerManagement
  order --> userManagement
  order --> auditLog
  order --> dashboard

  orderManagement --> order
  orderManagement --> customerManagement
  orderManagement --> auditLog

  paymentGateway --> order
```

## 5. Operations Dependencies

```mermaid
flowchart LR
  dashboard["dashboard"]
  salesStatistics["sales-statistics"]
  email["email"]
  order["order"]
  bookManagement["book-management"]
  catalogManagement["catalog-management"]
  customerManagement["customer-management"]
  userManagement["user-management"]
  auditLog["audit-log"]
  authentication["authentication"]

  dashboard --> order
  dashboard --> bookManagement
  dashboard --> catalogManagement
  dashboard --> customerManagement
  dashboard --> userManagement
  dashboard --> auditLog

  salesStatistics --> order

  email --> authentication
  email --> order
```

## Coupling Notes

These dependencies are worth knowing because they are stronger than simple
application-service composition:

- `catalog-management <-> book-management`: bidirectional infrastructure entity
  references for catalog/book relations.
- `book-management -> order`: book query infrastructure reads order/order-item
  data for sales-aware book queries.
- `order -> dashboard`: order query interfaces and implementations import
  dashboard read models for top catalog statistics.
- `cart-management -> user-management` and `order -> user-management`: cart and
  order persistence entities reference user entities.

If these areas are refactored, prefer moving shared read models or persistence
relations to a neutral boundary instead of adding more cross-folder imports.
