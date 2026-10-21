# Navigation

The public shell is [client/src/components/StoreShell.jsx](../../client/src/components/StoreShell.jsx).

On desktop, an icon rail links to home, the shop, the wishlist, and the bag. The bag button opens the cart drawer. On mobile, a sticky bar and a menu drawer expose the same destinations.

The category row sits on the homepage in [client/src/pages/user/home/HomeLayout.jsx](../../client/src/pages/user/home/HomeLayout.jsx):

- Clothing, Denim, Shoes, and Accessories go to `/shop?category=...`
- **CJ specials** goes to `/cj`

The sale banner and the Sales rail go to `/shop`. The homepage section under the sale rail is titled **cj special**.

The admin menu is [client/src/components/Sidebar.jsx](../../client/src/components/Sidebar.jsx). It includes **Sales** (`/admin/sales`) and **CJ** (`/admin/cj`) along with catalog, orders, customers, delivery, and settings. The admin label stays **CJ**. The public label is **CJ specials**.

`client/src/components/Navbar.jsx` is imported by older hero components. The homepage does not render those heroes, so that mega-menu is not the shop chrome.
