# Paystack

Use test keys from the Paystack dashboard while developing. Switch to live keys only after a test charge succeeds.

## Keys

In the Paystack dashboard, open Settings, then API Keys & Webhooks. Copy the secret key and the public key for the mode you are in.

Server (`server/.env`):

- `PAYSTACK_SECRET_KEY`
- `PAYSTACK_PUBLIC_KEY`

Storefront (`client/.env`):

- `VITE_PAYSTACK_PUBLIC_KEY`

The popup on checkout uses the public key. The server uses the secret key to initialize and verify. Never commit real keys. `server/.env.example` lists the names with placeholders.

## What the API does

Routes are in [server/routes/paymentRoutes.js](../../server/routes/paymentRoutes.js).

- `POST /api/payments/initialize` builds the charge from database prices. An active sale is applied with `salePriceFor`, so Paystack charges the same amount the bag shows. Guests send an email and the bag lines. A signed-in shopper is attached when a session exists. A `PendingPayment` row stores the snapshot.
- `POST /api/payments/verify` confirms the reference and writes the order. Guest orders leave `Order.userId` empty. The order number is `BY-` plus hex.
- `POST /api/payments/webhook` accepts Paystack's server callback.

The browser does not decide the line price. Local goods and CJ specials share this charge. What happens after the money is confirmed is in [buying-pipeline.md](buying-pipeline.md).

## Webhook

After deploy, set the Paystack webhook URL to:

`{BACKEND_URL}/api/payments/webhook`

That lets a successful charge update the order when the shopper closes the popup before verify runs. The handler checks the Paystack signature, then uses the same fulfillment function as verify.
