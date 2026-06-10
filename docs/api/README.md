# Backend API

Backend routes are served by the NestJS app with the global prefix `/api`.

Auth legend:

- `Public`: no guard in the controller.
- `Auth`: requires a valid JWT access token.
- `Admin`: requires JWT plus `admin` role.
- `Admin/Staff`: requires JWT plus `admin` or `staff` role.

## Health

| Method | Path | Auth | Function |
| --- | --- | --- | --- |
| GET | `/api` | Public | Returns the root app response. |

## Authentication And Email

| Method | Path | Auth | Function |
| --- | --- | --- | --- |
| POST | `/api/auth/login` | Public | Logs in with credentials, returns an access token, and sets refresh/user-role cookies. |
| POST | `/api/auth/register` | Public | Registers a new account and returns a temporary token for account completion/verification flow. |
| POST | `/api/auth/logout` | Auth | Invalidates the current session and clears auth cookies. |
| POST | `/api/auth/refresh` | Public | Uses the `refresh_token` cookie to issue a fresh access token. |
| PATCH | `/api/email/:email/verify` | Public | Verifies an email address using the verification payload in the request body. |

## Users, Customers, And Account

| Method | Path | Auth | Function |
| --- | --- | --- | --- |
| GET | `/api/users` | Admin | Lists users with pagination and filters: `page`, `limit`, `roleId`, `excludeRoleId`, `isActive`, `search`. |
| GET | `/api/users/:id` | Admin | Returns one user by id. |
| POST | `/api/users` | Admin | Creates a user and records the acting admin. |
| PUT | `/api/users/:id` | Admin | Updates a user profile/role data. |
| PATCH | `/api/users/:id/deactivate` | Admin | Deactivates a user account. |
| PATCH | `/api/users/:id/activate` | Admin | Reactivates a user account. |
| GET | `/api/customers` | Admin | Lists customers with pagination and filters: `page`, `limit`, `isActive`, `search`. |
| POST | `/api/customers/complete-information` | Public | Completes customer information using the `token` query parameter and body data. |
| GET | `/api/my-account/basic-info` | Auth | Returns the current user's basic account information. |
| GET | `/api/my-account/contact-info` | Auth | Returns the current user's phone/address contact information. |
| PATCH | `/api/my-account/email` | Auth | Changes the current user's email. |
| PUT | `/api/my-account/basic-info` | Auth | Updates the current user's basic profile information. |
| PATCH | `/api/my-account/phone-number` | Auth | Updates the current customer's phone number. |
| PATCH | `/api/my-account/password` | Auth | Changes the current user's password. |
| POST | `/api/my-account/address` | Auth | Adds a new address to the current customer's account. |
| DELETE | `/api/my-account/address/:id` | Auth | Removes one address from the current customer's account. |
| PATCH | `/api/my-account/address/:id/is-default` | Auth | Marks one address as the current customer's default address. |

## Roles And Permissions

| Method | Path | Auth | Function |
| --- | --- | --- | --- |
| GET | `/api/roles` | Admin | Lists all roles. |
| GET | `/api/roles/:id` | Admin | Returns one role and its details. |
| POST | `/api/roles` | Admin | Creates a new role. |
| PATCH | `/api/roles/:id` | Admin | Renames an existing role. |
| POST | `/api/roles/:id/permissions` | Admin | Grants a permission to a role. |
| DELETE | `/api/roles/:id/permissions/:permissionId` | Admin | Revokes a permission from a role. |
| DELETE | `/api/roles/:id` | Admin | Deletes a role. |
| GET | `/api/permissions` | Admin | Lists all permissions. |
| GET | `/api/permissions/:id` | Admin | Returns one permission by id. |
| POST | `/api/permissions` | Admin | Creates a permission. |
| DELETE | `/api/permissions/:id` | Admin | Deletes a permission. |

## Catalog Metadata

| Method | Path | Auth | Function |
| --- | --- | --- | --- |
| GET | `/api/authors` | Public | Lists authors with `page`, `limit`, and optional `search`. |
| GET | `/api/authors/:id` | Public | Returns one author by id. |
| POST | `/api/authors` | Admin | Creates an author. |
| PATCH | `/api/authors/:id` | Admin | Renames an author. |
| DELETE | `/api/authors/:id` | Admin | Deletes an author. |
| GET | `/api/genres` | Public | Lists genres with `page`, `limit`, and optional `search`. |
| GET | `/api/genres/:id` | Public | Returns one genre by id. |
| POST | `/api/genres` | Admin | Creates a genre. |
| PATCH | `/api/genres/:id` | Admin | Renames a genre. |
| DELETE | `/api/genres/:id` | Admin | Deletes a genre. |
| GET | `/api/languages` | Public | Lists languages with `page`, `limit`, and optional `search`. |
| GET | `/api/languages/:id` | Public | Returns one language by id. |
| POST | `/api/languages` | Admin | Creates a language. |
| PATCH | `/api/languages/:id` | Admin | Renames a language. |
| DELETE | `/api/languages/:id` | Admin | Deletes a language. |
| GET | `/api/publishers` | Public | Lists publishers with `page`, `limit`, and optional `search`. |
| GET | `/api/publishers/:id` | Public | Returns one publisher by id. |
| POST | `/api/publishers` | Admin | Creates a publisher. |
| PATCH | `/api/publishers/:id` | Admin | Renames a publisher. |
| DELETE | `/api/publishers/:id` | Admin | Deletes a publisher. |

## Books And Files

| Method | Path | Auth | Function |
| --- | --- | --- | --- |
| GET | `/api/books` | Public | Lists books with `page`, `limit`, and optional `search`. |
| GET | `/api/books/:id` | Public | Returns one book detail by id. |
| POST | `/api/books` | Admin/Staff | Creates a book. |
| PUT | `/api/books/:id` | Admin/Staff | Updates general book data. |
| POST | `/api/books/:id/book-cover` | Admin/Staff | Adds an uploaded cover URL to a book. |
| DELETE | `/api/books/:bookId/book-cover/:id` | Admin/Staff | Removes a cover from a book. |
| PATCH | `/api/books/:id/book-cover/:coverId` | Admin/Staff | Sets a cover as the primary book cover. |
| PATCH | `/api/books/:id/price` | Admin/Staff | Updates a book price. |
| PATCH | `/api/books/:id/discount-percentage` | Admin/Staff | Updates a book discount percentage. |
| PATCH | `/api/books/:id/stock/import` | Admin/Staff | Imports additional stock for a book. |
| PATCH | `/api/books/:id/stock/adjust` | Admin/Staff | Adjusts book stock to a target correction. |
| DELETE | `/api/books/:id` | Admin/Staff | Deletes a book. |
| GET | `/api/best-seller` | Public | Lists best-seller books with `page` and `limit`. |
| GET | `/api/on-sales` | Public | Lists books currently on sale with `page` and `limit`. |
| GET | `/api/new-arrivals` | Public | Lists new-arrival books with `page` and `limit`. |
| POST | `/api/files/upload` | Public | Uploads one multipart `file` up to 5 MB and returns its public upload URL. |

## Cart And Customer Orders

| Method | Path | Auth | Function |
| --- | --- | --- | --- |
| GET | `/api/carts` | Auth | Returns the current user's cart. |
| POST | `/api/carts` | Auth | Adds an item to the current user's cart. |
| DELETE | `/api/carts/:productId` | Auth | Removes a product from the current user's cart. |
| GET | `/api/my-orders` | Auth | Lists orders owned by the current user. |
| GET | `/api/my-orders/:id` | Auth | Returns one current-user order detail. |
| POST | `/api/my-orders` | Auth | Places an order for the current user. |
| PATCH | `/api/my-orders/:id/cancel` | Auth | Cancels one current-user order when allowed by order status. |

## Staff Order Management And Payments

| Method | Path | Auth | Function |
| --- | --- | --- | --- |
| GET | `/api/orders` | Admin/Staff | Lists all orders for staff/admin with `page`, `limit`, and optional `search`. |
| GET | `/api/orders/:id` | Admin/Staff | Returns one order detail for staff/admin. |
| PATCH | `/api/orders/:id/status` | Admin/Staff | Updates an order lifecycle status. |
| PATCH | `/api/orders/:id/payment-status/paid` | Admin/Staff | Marks an order payment status as paid. |
| POST | `/api/payment/orders/:orderId/momo` | Auth | Creates a MoMo payment transaction for an order. |
| POST | `/api/payment/orders/:orderId/mock` | Auth | Creates a mock payment transaction for local checkout flow. |
| POST | `/api/payment/mock/:transactionId/succeed` | Auth | Marks a mock payment transaction as succeeded for the current user. |
| POST | `/api/payment/mock/:transactionId/fail` | Auth | Marks a mock payment transaction as failed for the current user. |
| GET | `/api/payment/mock/:transactionId/scan/succeed` | Public | Simulates QR scan success for a mock payment transaction. |

## Dashboards, Reporting, And Audit

| Method | Path | Auth | Function |
| --- | --- | --- | --- |
| GET | `/api/admin-dashboard` | Admin | Returns admin overview metrics. |
| GET | `/api/staff-dashboard` | Admin/Staff | Returns staff operational dashboard metrics. |
| GET | `/api/shop-navigation` | Public | Returns storefront navigation data such as popular genres. |
| GET | `/api/sales-statistics` | Admin/Staff | Returns sales statistics by `period` and `value`. |
| GET | `/api/audit-logs` | Admin | Lists audit logs with `page`, `limit`, and optional `search`. |
