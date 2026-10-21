# CJ specials

How the CJ Dropshipping catalog is connected to buyy, and why it stays separate from the shop.

## What the shop shows

The category row under the search has **CJ specials**. That link opens `/cj`. The homepage rail under the sale products is titled **cj special**. Cards use a black `cj` badge and US dollar prices. They do not go into the buyy bag.

## Where the data lives

CJ products are not rows in the buyy `Product` table. Prisma stores them as:

- `CjAuth` — access token, refresh token, expiry times, and `openId`
- `CjProduct` — CJ product id, name, description, USD price, image, category, stock, and the `cj` tag
- `CjVariant` — CJ variant id, sku, price, and option label

The buyy shop, search, sales, and Paystack checkout keep reading `Product` only.

## How a sync works

The browser never calls CJ. [server/lib/cj.js](../../server/lib/cj.js) talks to `https://developers.cjdropshipping.com/api2.0/v1`.

1. The API key is `CJ_API_KEY` in `server/.env`. It is not committed and it is not sent to the client.
2. The server exchanges that key for an access token, stores the token, and refreshes it from the expiry dates CJ returns. It does not request a new token on every product call.
3. An admin opens `/admin/cj`, enters a keyword and a page count, and posts to `POST /api/admin/cj/sync`.
4. The server pages through `product/listV2`, then loads details and stock for each product, waiting about a second between calls. One click defaults to a single page of 20 products.
5. Those rows are upserted into `CjProduct` and `CjVariant`.

The storefront reads `GET /api/cj/products` and `GET /api/cj/products/:id` from that local table. A page view does not call CJ.

Admin status and the product list are `GET /api/admin/cj/status` and `GET /api/admin/cj/products`. The status response says whether a key is set and whether a token is active. It does not return the key or the token.
