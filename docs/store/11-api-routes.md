# API routes

Mounts are in [server/index.js](../../server/index.js). Everything below is under `/api`.

| Path | Role |
| --- | --- |
| `/auth` | Better Auth (sign-in, session) |
| `/products`, `/categories` | Public buyy catalog |
| `/search/storefront` | Name, description, and category search |
| `/sales` | Public sale read. Admin `PUT` updates percent, end time, and product ids |
| `/cart` | Account cart. Requires a session |
| `/orders` | Account and admin orders. `GET /orders/track` is public and is registered before `/:id` |
| `/payments` | Paystack initialize, verify, and webhook. Guests send email and bag lines |
| `/delivery` | Region and city fees, including a public calculate endpoint |
| `/users` | Profile, wishlist, account orders |
| `/admin/cj` | CJ status, stored products, and sync. Mounted before `/api/admin` so the upload router does not swallow it |
| `/admin` | Admin upload and related handlers |
| `/admin/analytics`, `/admin/settings`, `/admin/notifications`, `/admin/customers`, `/admin/images` | Admin tools |
| `/hero`, `/gallery` | Storefront config in `StoreConfig` |
| `/contact`, `/newsletter` | Public forms |
| `/cj` | Public CJ catalog: `GET /cj/products` and `GET /cj/products/:id` |
| `/healthz` | Process health check |

A page view of CJ specials reads the local `CjProduct` table. It does not call CJ. The admin sync (`POST /api/admin/cj/sync`) is what talks to CJ.

Checkout prices local lines with the active sale and CJ lines with the cedi rate before it asks Paystack for a charge. See [paystack.md](paystack.md) and [buying-pipeline.md](buying-pipeline.md).
