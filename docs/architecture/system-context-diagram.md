# System Context Diagram

This diagram shows the main runtime systems around Bookify. It is intentionally
kept at system boundary level; module internals are covered in
[module-dependency-diagram.md](./module-dependency-diagram.md).

```mermaid
flowchart LR
  Customer["Customer"]
  Staff["Staff user"]
  Admin["Admin user"]

  subgraph Bookify["Bookify ecommerce bookstore"]
    Nginx["Nginx reverse proxy\nport 80"]
    Frontend["Next.js frontend\nstorefront, auth, admin, staff"]
    Backend["NestJS API\n/api"]
    Uploads["Upload volume\n/storage/uploads\nserved as /uploads"]
  end

  MySQL[("MySQL 8.0\nbusiness data")]
  Redis[("Redis\ncache and token state")]
  Resend["Resend Email API"]
  Momo["MoMo payment gateway\nplus mock payment flow"]
  Provinces["Vietnam Provinces API\nprovince and district data"]

  Customer -->|storefront and account| Nginx
  Staff -->|operations and reports| Nginx
  Admin -->|admin management| Nginx

  Nginx -->|/| Frontend
  Nginx -->|/api| Backend
  Nginx -->|/uploads| Uploads

  Frontend -->|browser fetch via Nginx| Backend
  Frontend -->|server-side fetch with API_INTERNAL_URL| Backend
  Frontend -->|address lookup| Provinces

  Backend -->|TypeORM| MySQL
  Backend -->|cache repository and Keyv store| Redis
  Backend -->|book cover upload/delete| Uploads
  Backend -->|transactional email| Resend
  Backend -->|create provider payment| Momo
```
