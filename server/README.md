# GoMode API

Express API for the GoMode storefront. It handles catalog queries, bag calculations, Paystack checkout, orders, and authentication with PostgreSQL via Prisma.

<p>
  <img src="https://img.shields.io/badge/Express-5-black?logo=express&logoColor=white" alt="Express 5" />
  <img src="https://img.shields.io/badge/Prisma-6-black?logo=prisma&logoColor=white" alt="Prisma 6" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-black?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Better%20Auth-black" alt="Better Auth" />
  <img src="https://img.shields.io/badge/Paystack-black" alt="Paystack" />
</p>

## Stack

- Express 5 and Prisma 6
- PostgreSQL on Neon (`DATABASE_URL` for pooled client connections, `DIRECT_URL` for direct migrations)
- Better Auth for sessions (`/api/auth`)
- Paystack for payments (cards and mobile money)
- Cloudinary for image asset management
- Redis caching (optional) with in-memory fallback

## Scripts

```bash
cp .env.example .env
npm install
npx prisma db push
npm run dev          # nodemon, port 5000
npm start            # node index.js
```

### Seeding GoMode Catalog
To seed the 15 GoMode apparel products, categories, Ghana delivery regions, and the default admin user:

```bash
node scripts/seedGomodeCatalog.js
```

*Default Admin:* `admin@gomode.com` / `Admin1234!`

## Routes

All routes are mounted under `/api`:

| Path | Role | Description |
| --- | --- | --- |
| `/auth` | Public | Better Auth (sign-in, registration, session) |
| `/products`, `/categories` | Public | Apparel catalog and category taxonomy |
| `/search/storefront` | Public | Storefront keyword search |
| `/sales` | Public / Admin | Flash sale engine and timed promotional discounts |
| `/cart` | Authenticated | Server-side user cart management |
| `/orders` | Mixed | Order creation, tracking (`/orders/track`), and management |
| `/payments` | Public | Paystack transaction initialization and verification |
| `/delivery` | Public | Ghana regional shipping calculations |
| `/users` | Authenticated | Profile, wishlist, and customer order history |
| `/admin/*` | Admin | Dashboard metrics, inventory, customer lists, promotions |

## Environment

See `.env.example` for the complete list of required environment variables.
