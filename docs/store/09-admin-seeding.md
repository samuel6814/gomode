# Seeding

Two scripts live in `server/prisma/`.

## Full catalog seed

`server/prisma/seed.js` is what `npx prisma db seed` runs. It clears categories, products, and product images, then writes the fashion catalog, delivery fees, hero and gallery config, a timed sale, and an admin user. The sale is one `StoreConfig` row with key `SALES_SECTION`.

Run it only when replacing the catalog is acceptable. Orders you need to keep should not sit on a database you are about to seed.

## Store setup without a wipe

`server/prisma/setupStore.js` refreshes the admin user, adds the `buyy` tag to existing products that lack it, and upserts `SALES_SECTION`. It does not clear the catalog.

```bash
cd server
node prisma/setupStore.js
```

The admin email is set inside those scripts. The password is set there too. Do not copy the password into docs, commits, or chat logs. Change it after the first login on any shared database.
