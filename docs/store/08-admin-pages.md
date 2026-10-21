# Admin pages

Admin routes sit under `/admin` and require the `ADMIN` role. They are declared in [client/src/main.jsx](../../client/src/main.jsx). The menu is [client/src/components/Sidebar.jsx](../../client/src/components/Sidebar.jsx).

| Path | Screen |
| --- | --- |
| `/admin`, `/admin/dashboard` | Dashboard |
| `/admin/products` | Catalog, including add and edit |
| `/admin/category` | Categories |
| `/admin/orders` | Orders |
| `/admin/commissions` | Commission inbox |
| `/admin/customers` | Customers |
| `/admin/library` | Image library (Cloudinary) |
| `/admin/heroconfig` | Hero config stored in `StoreConfig` |
| `/admin/gallery` | Gallery config |
| `/admin/analytics` | Analytics |
| `/admin/settings` | Settings |
| `/admin/delivery` | Delivery fees |
| `/admin/sales` | Sale percent, end time, and included products |
| `/admin/cj` | CJ catalog sync |

`/admin/sales` writes the `SALES_SECTION` row. The homepage banner, product cards, the bag, and Paystack all read that same row.

`/admin/cj` syncs CJ products into `CjProduct` and `CjVariant`. It does not write buyy `Product` rows. See [docs/cj-specials/README.md](../cj-specials/README.md).

The homepage wordmark is part of the storefront design, not a field on the hero screen.
