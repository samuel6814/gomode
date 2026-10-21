# buyy store guides

These notes describe the buyy shop as it runs today. Prices are in Ghana cedis. Shoppers can browse, bag items, and pay with Paystack without an account. Signed-in customers get a saved cart, a wishlist, and an order history.

The storefront is React and Vite in `client/`. The API is Express and Prisma in `server/`. Postgres holds the catalog, orders, and the sale. CJ Dropshipping is a second catalog and stays out of the buyy product table.

## Reading order

1. [Initial setup](01-initial-setup.md)
2. [Branding](02-branding.md)
3. [Homepage](03-hero-section.md)
4. [Login](04-login-page.md)
5. [Navigation](05-navbar-menus.md)
6. [Commissions](06-commissions-page.md)
7. [Contact](07-contact-page.md)
8. [Admin pages](08-admin-pages.md)
9. [Seeding](09-admin-seeding.md)
10. [Database](10-database-changes.md)
11. [API routes](11-api-routes.md)
12. [Social links](12-whatsapp-social.md)
13. [Git](13-git-cleanup.md)
14. [Deployment](deployment.md)
15. [Architecture](architecture.md)
16. [Paystack](paystack.md)
17. [Buying pipeline](buying-pipeline.md)

Day-to-day commands also live in [client/README.md](../../client/README.md) and [server/README.md](../../server/README.md).

CJ specials are documented in [docs/cj-specials/README.md](../cj-specials/README.md). The compiled API manual is [docs/cj-manual/cj-dropshipping.pdf](../cj-manual/cj-dropshipping.pdf).
