# Homepage

The live homepage is [client/src/pages/user/home/HomeLayout.jsx](../../client/src/pages/user/home/HomeLayout.jsx), mounted at `/` and `/home`. Older hero files in the same folder are not what the shop renders.

From top to bottom:

1. The buyy wordmark and the search field. Search matches the product name, the description, and the category name.
2. A category row: Clothing, Denim, Shoes, Accessories, then a link labeled **CJ specials** that goes to `/cj`.
3. A black sale banner with the discount percent and a countdown, linking to `/shop`, when a sale is active.
4. A sale product rail. Cards show the struck Ghana cedi price, the sale price, the buyy badge, and a bag button.
5. A rail titled **cj special** when CJ products are stored. Those cards show a US dollar price and a `cj` badge. They do not add to the buyy bag.
6. Category rails. The Shoes group is a Knits bento (two cardigans). The dress shoe stays in the shop under Shoes. The knit names are left out of the Clothing scroller so they are not listed twice.

Sale data comes from `GET /api/sales`. CJ cards come from `GET /api/cj/products`.
