# Database

The schema is [server/prisma/schema.prisma](../../server/prisma/schema.prisma). Apply migrations with `npx prisma migrate deploy` from `server/`. That command uses `DIRECT_URL`. The running API uses `DATABASE_URL` (the pooled Neon URL).

## buyy catalog and orders

- `User`, `Session`, `Account`, `Verification` — Better Auth.
- `Product`, `ProductImage`, `Category` — the Ghana cedi catalog. `Product.tags` holds `buyy` for current items.
- `Cart`, `CartItem`, `Wishlist` — the signed-in bag and wishlist.
- `Order`, `OrderItem`, `ShippingAddress` — `Order.userId` is optional so a guest checkout can exist. `orderNumber` is unique (`BY-` plus hex).
- `PendingPayment` — snapshot taken before Paystack confirms the charge.
- `DeliveryFee` — region and city fees.
- `StoreConfig` — JSON config. The sale is the row whose `key` is `SALES_SECTION` (`discountPercent`, `endsAt`, `productIds`). Hero and gallery config use the same table.
- `ContactMessage`, `Subscriber`, `Image`, `DashboardStats`.

## CJ catalog

These tables are separate from `Product`:

- `CjAuth` — access token, refresh token, expiry times, and `openId`. One row, id `default`. Server only.
- `CjProduct` — CJ `pid`, USD price, image, category name, stock, tags (always includes `cj`).
- `CjVariant` — `vid`, `sku`, price, option label. Deleting a product cascades to its variants.

Do not put CJ rows into `Product`. The shop, search, sale, and Paystack checkout read `Product` only.
