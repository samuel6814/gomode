# Login

Sign-in is Better Auth at `/login`. Password reset uses `/forgot-password` and `/reset-password`. Google sign-in is optional and needs `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` on the server.

A session is required for `/profile`, `/orders`, `/wishlist`, `/notifications`, and `/alerts`. Admin screens under `/admin` require the `ADMIN` role.

Guests can still shop. The guest bag is stored in the browser under the key `buyy-guest-cart`. Checkout at `/checkout` works without an account: the shopper sends an email and the bag lines. Signing in merges the guest bag into the account cart.

The cart drawer opens from the icon rail, the mobile menu, and the bag button on the right edge. **View full bag** goes to `/cart`. **Checkout** goes to `/checkout`.
