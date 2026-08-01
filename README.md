# Bookify Ecommerce Bookstore

| Language / Ngôn ngữ |
| :--- |
| [English](#english) |
| [Tiếng Việt](#tiếng-việt) |

---

## English

[Read in Vietnamese →](#tiếng-việt)

Bookify is an ecommerce bookstore application built as a full-stack monorepo. It includes a NestJS API, a Next.js storefront/admin interface, MySQL persistence, Redis caching, Nginx reverse proxying, and Docker-based local orchestration.

![Homepage](docs/images/homepage.png)

### Highlighted Features

- **Customer storefront:** Browse best sellers, new arrivals, on-sale books, genre collections, product details, cart, checkout, mock/VNPay payment, and customer order history.
- **AI customer support chatbot:** A floating chat widget available on every shop page, powered by an LLM (Groq) with:
  - **Guest access** — non-logged-in visitors can chat immediately using an anonymous guest ID, while authenticated users get their own persistent chat history.
  - **Real-time streaming** — answers stream token-by-token over Server-Sent Events through a buffering-disabled Nginx proxy.
  - **Catalog-grounded answers** — the AI only answers from real products fetched from the database (intent-aware search: bestsellers, new arrivals, title/author/ISBN), preventing hallucinated books.
  - **RAG knowledge base** — admin-managed knowledge sources are chunked, embedded, and retrieved to answer store-policy questions.
  - **Anti-abuse hardening** — strict system prompt that refuses off-topic requests and prompt-injection attempts, and never reveals internal rules.
  - **Markdown responses** — bold, italic, line breaks, and lists rendered client-side.
  - **Multilingual (i18n)** — widget UI and suggested questions localized in Vietnamese and English.
- **Authentication:** Email/password login, JWT refresh sessions, Google OAuth login, and profile completion for newly created OAuth users.
- **Popularity-aware navigation:** Homepage category cards and navbar genre links prioritize the most popular genres from recent sales, with catalog fallback when sales data is not available.
- **Staff operations:** Staff can manage books, import stock, handle orders, inspect customer records, and monitor operational dashboard metrics.
- **Sales statistics:** Staff reporting supports monthly, quarterly, and yearly filters from the reporting start period, using real order and order item aggregates for revenue, orders, books sold, average order value, payment channels, category revenue, and top-selling books.
- **Admin management:** Admin pages cover users, genres, publishers, authors, languages, roles, permissions, and system overview metrics.
- **Order lifecycle:** Orders support placement, confirmation, delivery progress, completion, cancellation, payment status tracking, audit logging, and transactional email notifications.
- **Email notifications:** Automated email delivery via Resend for account verification (OTP) and order lifecycle events (confirmation, delivery, completion, cancellation).
- **Payments:** Mock payment for local development plus real VNPay sandbox integration with retry support and payment status tracking.

### Tech Stack

- **Backend:** NestJS, TypeScript, TypeORM, JWT authentication, Passport Google OAuth
- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Database:** MySQL 8.0
- **Cache:** Redis
- **AI:** Groq (LLM API, OpenAI-compatible), Server-Sent Events streaming
- **Web server:** Nginx
- **Containerization:** Docker, Docker Compose
- **Package manager:** pnpm

### Project Structure

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

### Prerequisites

For Docker-based development:

- Docker Engine or Docker Desktop
- Docker Compose

For local development without Docker:

- Node.js 22+
- pnpm 9.15.4+
- MySQL 8.0
- Redis

### Environment Setup

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

### Run With Docker Compose

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

### Run Locally

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

### Scripts

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

### Backend Modules

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

### Email Notifications

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

### AI Chatbot

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

### Frontend Areas

The frontend is organized by application area:

- Authentication pages and components
- Customer-facing shop pages
- Checkout and customer order pages
- Admin management pages
- Staff operational pages
- Shared auth and common UI utilities

### Nginx Routing

Nginx is the public entry point in Docker Compose:

- `/` proxies to the Next.js frontend
- `/api` proxies to the NestJS backend
- `/uploads/` serves uploaded files from `storage/uploads`
- `/_next/` proxies Next.js assets without caching in development

### Notes

- Uploaded files are stored under `storage/uploads` and mounted into both backend and Nginx.
- MySQL, Redis, RedisInsight, backend `node_modules`, frontend `node_modules`, and Next.js cache use Docker named volumes.
- The backend API listens on port `3000` by default unless `PORT` is provided.

---

## Tiếng Việt

[Đọc bằng tiếng Anh →](#english)

Bookify là ứng dụng thương mại điện tử bán sách được xây dựng theo mô hình monorepo full-stack, gồm API NestJS, giao diện storefront/admin bằng Next.js, lưu trữ MySQL, cache Redis, reverse proxy Nginx và dàn dựng Docker cho môi trường cục bộ.

![Homepage](docs/images/homepage.png)

### Tính năng nổi bật

- **Storefront cho khách hàng:** Duyệt sách bán chạy, sách mới, sách giảm giá, bộ sưu tập theo thể loại, chi tiết sản phẩm, giỏ hàng, thanh toán (mock/VNPay) và lịch sử đơn hàng của khách.
- **Chatbot hỗ trợ khách hàng bằng AI:** Widget chat nổi xuất hiện trên mọi trang shop, chạy trên nền LLM (Groq) với:
  - **Hỗ trợ khách vãng lai** — khách chưa đăng nhập có thể chat ngay bằng guest ID ẩn danh, còn người dùng đã đăng nhập có lịch sử chat riêng lưu bền.
  - **Streaming thời gian thực** — câu trả lời trả về từng token qua Server-Sent Events qua proxy Nginx đã tắt buffering.
  - **Câu trả lời bám sát catalog** — AI chỉ trả lời dựa trên sản phẩm thật truy vấn từ database (tìm kiếm theo ý định: sách bán chạy, sách mới, tiêu đề/tác giả/ISBN), chống "bịa" sách.
  - **Kho tri thức RAG** — các nguồn kiến thức do admin quản lý được tách chunk, embedding và truy vấn để trả lời câu hỏi về chính sách của cửa hàng.
  - **Chống lạm dụng** — system prompt nghiêm ngặt từ chối các câu hỏi ngoài lề và các nỗ lực prompt injection, không bao giờ tiết lộ quy tắc nội bộ.
  - **Trả lời dạng markdown** — in đậm, in nghiêng, xuống dòng và danh sách được render phía client.
  - **Đa ngôn ngữ (i18n)** — giao diện widget và câu hỏi gợi ý được bản địa hóa tiếng Việt và tiếng Anh.
- **Xác thực:** Đăng nhập email/mật khẩu, phiên JWT refresh, đăng nhập Google OAuth và hoàn tất hồ sơ cho người dùng OAuth mới tạo.
- **Điều hướng theo độ phổ biến:** Các thẻ thể loại trên trang chủ và liên kết thể loại trên navbar ưu tiên thể loại bán chạy gần đây, dự phòng bằng catalog khi không có dữ liệu bán hàng.
- **Thao tác cho nhân viên:** Nhân viên quản lý sách, nhập kho, xử lý đơn hàng, xem hồ sơ khách hàng và theo dõi các chỉ số dashboard vận hành.
- **Thống kê doanh thu:** Báo cáo cho nhân viên hỗ trợ lọc theo tháng, quý, năm từ kỳ báo cáo đầu tiên, dùng tổng hợp thực tế từ đơn hàng và chi tiết đơn để tính doanh thu, số đơn, số sách bán ra, giá trị đơn trung bình, kênh thanh toán, doanh thu theo thể loại và sách bán chạy nhất.
- **Quản trị admin:** Các trang quản trị gồm người dùng, thể loại, nhà xuất bản, tác giả, ngôn ngữ, vai trò, quyền hạn và các chỉ số tổng quan hệ thống.
- **Vòng đời đơn hàng:** Đơn hàng hỗ trợ đặt, xác nhận, tiến trình giao, hoàn tất, hủy, theo dõi trạng thái thanh toán, audit log và email thông báo theo sự kiện.
- **Email thông báo:** Gửi email tự động qua Resend cho xác minh tài khoản (OTP) và các sự kiện vòng đời đơn hàng (xác nhận, giao hàng, hoàn tất, hủy).
- **Thanh toán:** Thanh toán mock cho phát triển cục bộ cùng tích hợp sandbox VNPay thật với hỗ trợ retry và theo dõi trạng thái thanh toán.

### Công nghệ sử dụng

- **Backend:** NestJS, TypeScript, TypeORM, JWT authentication, Passport Google OAuth
- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Database:** MySQL 8.0
- **Cache:** Redis
- **AI:** Groq (LLM API, tương thích OpenAI), streaming Server-Sent Events
- **Web server:** Nginx
- **Containerization:** Docker, Docker Compose
- **Package manager:** pnpm

### Cấu trúc dự án

```text
.
|-- backend/                 # API NestJS
|   |-- src/
|   |   |-- modules/         # Các module nghiệp vụ
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
|   |   `-- shared/          # Domain, HTTP, infrastructure và module dùng chung
|   |-- Dockerfile
|   `-- package.json
|-- frontend/                # Ứng dụng Next.js
|   |-- src/app/
|   |   |-- (authentication)/
|   |   |-- (shop)/
|   |   |-- admin/
|   |   `-- staff/
|   |-- Dockerfile
|   `-- package.json
|-- nginx/
|   `-- nginx.conf           # Reverse proxy và phục vụ file upload tĩnh
|-- storage/uploads/         # File upload được mount vào backend và Nginx
|-- docker-compose.yaml
|-- .env.example
|-- backend/.env.example
`-- frontend/.env.example
```

### Yêu cầu tiên quyết

Phát triển bằng Docker:

- Docker Engine hoặc Docker Desktop
- Docker Compose

Phát triển cục bộ không dùng Docker:

- Node.js 22+
- pnpm 9.15.4+
- MySQL 8.0
- Redis

### Cấu hình môi trường

Tạo các file env từ file mẫu:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Với Docker Compose, dùng tên service trong các file env chạy trong container:

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

Khi phát triển cục bộ không dùng Docker, thay `mysql_db`, `redis_cache` và `backend_app` bằng địa chỉ localhost tương ứng với dịch vụ đang chạy.

### Chạy bằng Docker Compose

Build và khởi động toàn bộ hệ thống:

```bash
docker compose up --build
```

Các service mặc định:

- Frontend: http://localhost
- Backend API: http://localhost/api
- MySQL: localhost:3306
- Redis: localhost:6379
- RedisInsight: http://localhost:8001

Dừng hệ thống:

```bash
docker compose down
```

Dừng và xóa các named volume:

```bash
docker compose down -v
```

### Chạy cục bộ

Khởi động MySQL và Redis trước, sau đó cấu hình `backend/.env` và `frontend/.env` cho địa chỉ cục bộ.

Cài đặt và chạy backend:

```bash
cd backend
corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm install
PORT=3001 pnpm start:dev
```

Cài đặt và chạy frontend:

```bash
cd frontend
corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm install
pnpm dev
```

Khi chạy backend cục bộ ở port `3001`, cấu hình:

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

Với Google OAuth, đăng ký callback URL tương ứng trong Google Cloud Console. Khi chạy Docker/Nginx, redirect URI thường là `http://localhost/api/auth/google/callback`; khi chạy backend cục bộ ở port `3001`, dùng `http://localhost:3001/api/auth/google/callback`.

Sau đó mở http://localhost:3000.

### Scripts

Scripts backend:

```bash
cd backend
pnpm start:dev    # Chạy API ở chế độ watch
pnpm build        # Build output production
pnpm start:prod   # Chạy output production đã compile
pnpm lint         # Lint và tự sửa
pnpm test         # Chạy unit tests
pnpm test:e2e     # Chạy e2e tests
pnpm test:cov     # Chạy tests kèm coverage
```

Scripts frontend:

```bash
cd frontend
pnpm dev          # Chạy server dev của Next.js
pnpm build        # Build output production
pnpm start        # Chạy server production
pnpm lint         # Chạy ESLint
```

### Các module backend

Backend được tổ chức theo cấu trúc module. Mỗi module nghiệp vụ được phân chia theo các ranh giới rõ ràng như `domain`, `application`, `infrastructure` và `presentation`.

Các module chính:

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

### Email thông báo

Backend dùng module `email` và email sender đã cấu hình để gửi email giao dịch từ các domain event.

Cấu hình gửi email trong `backend/.env`:

```env
RESEND_API_KEY=your_resend_api_key
EMAIL_DELIVERY_MODE=dev-inbox
DEV_EMAIL_INBOX=your_resend_account_email
EMAIL_FROM=onboarding@resend.dev
EMAIL_REPLY_TO=onboarding@resend.dev
```

Các chế độ gửi hỗ trợ:

- `resend`: gửi email trực tiếp đến người nhận thật qua Resend.
- `dev-inbox`: chuyển hướng toàn bộ email đi đến `DEV_EMAIL_INBOX`.
- `log`: không gửi email; chỉ log payload email.

Email vòng đời đơn hàng:

- `OrderPlaced`: gửi khi khách đặt đơn.
- `OrderConfirmed`: gửi khi nhân viên xác nhận đơn chờ xử lý.
- `OrderDeliveryStarted`: gửi khi nhân viên bắt đầu giao hàng.
- `OrderDelivered`: gửi khi nhân viên đánh dấu đơn đã giao.
- `OrderCompleted`: gửi khi nhân viên hoàn tất đơn.
- `OrderCanceled`: gửi khi khách hủy đơn.

Email đơn hàng chỉ được gửi sau khi giao dịch đơn hàng liên quan thành công.

### Chatbot AI

Module `chatbot` vận hành widget chat nổi xuất hiện trên các trang shop. Nó kết hợp công cụ tìm kiếm catalog trực tiếp với kho tri thức Retrieval-Augmented Generation (RAG).

Cấu hình AI trong `backend/.env`:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
```

Cách hoạt động:

- **Hỗ trợ khách vãng lai:** Khách chưa xác thực nhận một `x-guest-id` ẩn danh (lưu trong `localStorage`). Backend dùng optional JWT guard — người dùng thật nhận diện bằng JWT, khách vãng lai bằng guest ID. Các endpoint tri thức chỉ dành cho admin vẫn được bảo vệ.
- **Bám sát catalog:** Câu hỏi của người dùng được phân loại theo ý định (sách bán chạy, sách mới, tìm kiếm thường), sau đó đối chiếu với database sản phẩm thật (tiêu đề, tác giả, ISBN). Chỉ những sản phẩm khớp được đưa vào system prompt làm ngữ cảnh, nên AI không bao giờ bịa sách.
- **RAG:** Admin quản lý các nguồn tri thức (chính sách cửa hàng, câu hỏi thường gặp) được tách chunk, embedding và truy vấn làm ngữ cảnh cho câu hỏi của khách.
- **Streaming:** `POST /sessions/:id/messages/stream` trả về phản hồi Server-Sent Events và Nginx được cấu hình proxy không buffering.
- **An toàn:** system prompt nghiêm ngặt giữ trợ lý đúng chủ đề, chặn các yêu cầu ngoài lề và từ chối các nỗ lực prompt injection.

Phiên chat được phạm vi theo từng người dùng/khách: session, tin nhắn và lịch sử bị cô lập theo danh tính. Frontend render markdown (in đậm, in nghiêng, danh sách) và cung cấp câu hỏi gợi ý đã bản địa hóa.

### Các khu vực frontend

Frontend được tổ chức theo khu vực ứng dụng:

- Trang và component xác thực
- Trang shop dành cho khách
- Trang thanh toán và đơn hàng của khách
- Trang quản trị admin
- Trang vận hành nhân viên
- Auth dùng chung và tiện ích UI chung

### Routing Nginx

Nginx là điểm vào công khai trong Docker Compose:

- `/` proxy đến frontend Next.js
- `/api` proxy đến backend NestJS
- `/uploads/` phục vụ file upload từ `storage/uploads`
- `/_next/` proxy asset Next.js không cache trong môi trường dev

### Ghi chú

- File upload được lưu trong `storage/uploads` và được mount vào cả backend lẫn Nginx.
- MySQL, Redis, RedisInsight, `node_modules` của backend, `node_modules` của frontend và cache Next.js dùng Docker named volumes.
- Backend API mặc định lắng nghe port `3000` trừ khi cấu hình `PORT`.
