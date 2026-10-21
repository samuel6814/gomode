# Architecture

buyy is a React storefront and an Express API. Postgres holds the catalog and orders. Paystack takes payment. CJ Dropshipping is a second catalog with its own tables and routes.

## Storefront

`client/` is Vite, React 18, styled-components, and React Router. TanStack Query and axios load the API. `VITE_API_URL` is the base, including `/api`.

[client/src/components/StoreShell.jsx](../../client/src/components/StoreShell.jsx) wraps the public pages: icon rail, mobile header, search, and the cart drawer. Admin screens use their own layout and [client/src/components/Sidebar.jsx](../../client/src/components/Sidebar.jsx).

Routes are listed in [client/src/main.jsx](../../client/src/main.jsx). Public shop routes include `/`, `/shop`, `/product/:id`, `/cart`, `/checkout`, `/track`, `/cj`, and `/cj/:id`. Account routes sit behind a session. `/admin` requires the `ADMIN` role.

The guest bag is `localStorage` key `buyy-guest-cart`. A signed-in shopper uses `GET` and `POST /api/cart`. Signing in merges the guest bag into that cart.

## API

`server/index.js` mounts routes under `/api`. Prisma talks to Postgres. Better Auth serves `/api/auth`. CORS allows `http://localhost:5173` in development and `FRONTEND_URL` when it is set.

GET caching uses Redis when `REDIS_URL` is a real instance. Otherwise it stays in memory.

## Sale price

One `StoreConfig` row, key `SALES_SECTION`, holds the discount percent, the end time, and the product ids. `GET /api/sales` is public. The homepage banner, cards, search, and the bag read it.

Checkout does not trust the price the browser sends. [server/routes/paymentRoutes.js](../../server/routes/paymentRoutes.js) loads each product and applies `salePriceFor` from [server/lib/sale.js](../../server/lib/sale.js) before the Paystack amount is built.

## CJ catalog

The browser never calls CJ. `CJ_API_KEY` stays in `server/.env`. [server/lib/cj.js](../../server/lib/cj.js) caches the access token on `CjAuth`, pages `listV2`, then loads detail and stock into `CjProduct` and `CjVariant`.

The shop reads `GET /api/cj/products`. Those items are tagged `cj`. Checkout converts the variant price to cedis and can charge them on the same Paystack order as local goods. See [buying-pipeline.md](buying-pipeline.md).

## Payments

See [paystack.md](paystack.md). Initialize and verify run on the server. Guests check out with an email and bag lines. Order numbers look like `BY-` plus hex. `/track` looks up an order with that number and the checkout email.
