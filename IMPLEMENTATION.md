# UniHive implementation guide

UniHive is a direct-payment student marketplace built with Next.js, Express, and MongoDB.

## Implemented MVP flows

- Registration, login, logout, cookie authentication, and role authorization
- User profiles and private student-ID verification submission
- Admin seller approval and rejection
- Seller listing creation, editing, archival, moderation status, inventory, and analytics
- Marketplace search, type filters, sorting, product details, and buyer reviews
- Buyer order requests, cancellation, WhatsApp contact, and review submission
- Seller order acceptance, rejection, shipping, and delivery transitions
- Admin user, product, order, verification, and report management
- Product reporting and resolution workflow
- Soft account deletion and product archival to preserve commerce history

## Local setup

1. Copy `server/.env.example` to `server/.env` and configure MongoDB and a strong JWT secret.
2. Copy `client/.env.example` to `client/.env.local`. `API_URL` is used by the same-origin authentication proxy; `NEXT_PUBLIC_API_URL` is only used to resolve media URLs.
3. Install packages in `client` and `server` with `npm install`.
4. Run `npm run dev:server` and `npm run dev:client` in separate terminals from the repository root.
5. Seed the first administrator with `npm --prefix server run seed:admin`.

Run `npm run check` before a release.

## Production requirements

- Put the frontend and API on same-site HTTPS domains where possible.
- Replace local student-ID storage with private S3-compatible storage and signed admin URLs.
- Never expose the `server/uploads/student-ids` directory as static content.
- Set a restricted `FRONTEND_URL` and a long random `JWT_SECRET`.
- Use a managed MongoDB replica set before adopting multi-document transactions.
- Add database backups, error monitoring, uptime checks, and log retention.

## Intentionally deferred

Platform-controlled payments, escrow, integrated shipping, in-app chat, recommendations, and native mobile applications are post-MVP features.
