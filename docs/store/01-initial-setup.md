# Initial setup

You need Node.js and a Postgres database. Copy the env examples and fill in your own values. Do not commit `.env` files.

## API

```bash
cd server
cp .env.example .env
npm install
npx prisma migrate deploy
npm run dev
```

The API listens on port 5000. `DATABASE_URL` is the pooled connection Prisma uses at runtime. `DIRECT_URL` is the direct connection Prisma uses for migrations.

## Storefront

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Open the shop at [http://localhost:5173](http://localhost:5173). In development the API allows that origin. `http://127.0.0.1:5173` is a different origin, so the browser blocks the API calls and the homepage looks empty.

`VITE_API_URL` should include `/api`. The local value is `http://localhost:5000/api`.

## Seed

From `server/`:

```bash
npx prisma db seed
```

That command replaces the catalog. Categories, products, and product images are cleared and written again. It also writes delivery fees, hero and gallery config, a timed sale, and an admin user. Run it when you want a fresh catalog, not when you only want to add one product.

Names of the server variables are listed in `server/.env.example`. Names of the client variables are `VITE_API_URL` and `VITE_PAYSTACK_PUBLIC_KEY`.
