# buyy API

Express API for the store. It prices the bag, talks to Paystack, and stores catalog, orders, and the sale in Postgres.

<p>
  <img src="https://img.shields.io/badge/Express-5-black?logo=express&logoColor=white" alt="Express 5" />
  <img src="https://img.shields.io/badge/Prisma-6-black?logo=prisma&logoColor=white" alt="Prisma 6" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-black?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Better%20Auth-black" alt="Better Auth" />
  <img src="https://img.shields.io/badge/Redis-optional-black?logo=redis&logoColor=white" alt="Redis optional" />
  <img src="https://img.shields.io/badge/Paystack-black" alt="Paystack" />
</p>

## Stack

- Express 5 and Prisma 6
- PostgreSQL on Neon. `DATABASE_URL` is the pooled URL the app uses. `DIRECT_URL` is the direct URL Prisma uses for migrations.
- Better Auth for sessions (`/api/auth`)
- Paystack for charges. Line prices come from the database, with the active sale applied.
- Cloudinary for images uploaded in the admin library
- Redis only when `REDIS_URL` is set to a real instance. Otherwise GET caching stays in memory. The local default `redis://localhost:6379` is ignored on purpose.

## Scripts

```bash
cp .env.example .env
npm install
npx prisma migrate deploy
npm run dev          # nodemon, port 5000
npm start            # node index.js
```

`package.json` sets the Prisma seed to `node prisma/seed.js`. From this folder:

```bash
npx prisma db seed
```

Seeding **replaces** the catalog. It deletes products, categories, and product images, then writes the current fashion catalog, delivery fees, storefront config, a 48-hour sale, and an admin user. Do not run it against a database whose orders or catalog you need to keep.

## Routes

All of these sit under `/api`.

| Path | Role |
| --- | --- |
| `/auth` | Better Auth (sign-in, session) |
| `/products`, `/categories` | Public catalog |
| `/search/storefront` | Name, description, and category search |
| `/sales` | Public sale read. Admin `PUT` updates percent, end time, and product ids |
| `/cart` | Account cart. Requires a session |
| `/orders` | Account and admin orders. `GET /orders/track` is public and is registered before `/:id` |
| `/payments` | Paystack initialize and verify. Guests send email and bag lines |
| `/delivery` | Region and city fees, including a public calculate endpoint |
| `/users` | Profile, wishlist, account orders |
| `/admin/*` | Analytics, customers, settings, notifications, images |
| `/hero`, `/gallery` | Storefront config stored in `StoreConfig` |
| `/contact`, `/newsletter` | Public forms |

The sale lives in `StoreConfig` under the key `SALES_SECTION`. Checkout reads that same row when it prices a line, so the amount Paystack charges matches the storefront.

## Environment

Copy names from `.env.example`. Do not commit real values.

Required to boot and migrate: `PORT`, `DATABASE_URL`, `DIRECT_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `SESSION_SECRET`, `FRONTEND_URL`.

Required to take payment: `PAYSTACK_SECRET_KEY`. The client uses its own public key.

Optional: Cloudinary keys, Google OAuth keys, SMTP settings, and `REDIS_URL`.
