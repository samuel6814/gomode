# Buying and payment pipeline

One bag, one Paystack charge in cedis. The bag may hold local buyy goods, CJ specials, or both. The server prices every line. The browser never sends a price.

After Paystack confirms the money, each line follows only the path that belongs to it. A local-only order never calls CJ.

## Shared steps

1. The product page adds the piece to the bag, or Buy now opens checkout with that piece in the bag.
2. `POST /api/payments/initialize` loads the bag from the database (or from the guest lines), prices it, and asks Paystack to start a charge. A `PendingPayment` row stores the snapshot and the reference.
3. The shopper pays in the Paystack window. The retail total goes to the buyy merchant account.
4. The popup sends the reference to `POST /api/payments/verify`. The Paystack webhook (`POST /api/payments/webhook`) calls the same fulfillment function. The success page waits for verify.
5. Fulfillment checks, in order:
   - An order already stored for this reference returns success and does not fulfill again.
   - Paystack `data.status` must be `success`. `data.status` on the HTTP envelope only means the verify call itself worked.
   - Paystack `data.amount` is in pesewas and must match the stored total.
   - The order row is created with a unique `transactionRef`. A second request that races the first cannot insert another order.
6. The confirmation email and the admin notice go out for every paid order.

The webhook checks the `x-paystack-signature` HMAC (SHA512 of the raw body, keyed with the secret) before it fulfills.

Test keys live only in gitignored env files: `PAYSTACK_SECRET_KEY` and `PAYSTACK_PUBLIC_KEY` on the server, `VITE_PAYSTACK_PUBLIC_KEY` on the storefront. See [paystack.md](paystack.md).

## Local goods

This path runs only for buyy catalog lines.

- **Price.** `salePriceFor` reads `SALES_SECTION`. A product in the sale is charged at the sale price. Every other local product stays at its list price in cedis.
- **Stock.** Initialize refuses a line the store cannot fill. After payment, `Product.stock` drops by the paid quantity.
- **Delivery.** Standard delivery uses `DeliveryFee` for the region and city, or 25 cedis when no row matches. Pickup is free. A bag with no local lines does not add this fee.
- **Fulfillment.** buyy packs the order and ships it, or the customer collects it. Status stays `PENDING` until the store sets `PROCESSING`, `SHIPPED`, or `DELIVERED`.
- **Tracking.** `/track` matches the order number and the checkout email. It does not call CJ.
- **Returns.** Report within 24 hours, and only when the item arrived damaged or the wrong item was sent. Change of mind, and size issues that were not the store's mistake, are not returns.

## CJ specials

This path runs only for CJ lines, after the same paid-order write.

- **Price.** The shopper picks a variant. The charge uses `cediPriceFor` on that variant (`usd × usdToGhs × (1 + taxPercent / 100)`).
- **Freight.** Initialize calls `POST /logistic/freightCalculate` (weight comes from the variant lines, ship-from `CN`, destination from the checkout country). The cheapest option's USD price is converted with `usdToGhs` and added as shipping. Product tax is already inside the cedi price, so freight is not taxed again. A local-only bag skips this call. A mixed bag pays the local delivery fee and this freight as separate amounts.
- **Order.** Fulfillment calls `POST /shopping/order/createOrderV3` with each `vid` and quantity, the checkout address, `shopLogisticsType` 2, empty storage, `orderFlow` 1, `fromCountryCode` `CN`, `payType` 3, and the quoted `logisticName`. `payType` 3 creates the order and does not pay it.
- **Test mode.** When the Paystack secret is a test key, create sends `isSandbox` 1 and does not call `payBalanceV2`. The CJ wallet is not spent.
- **Live mode.** A live secret, after a successful sandbox proof, checks `GET /shopping/pay/getBalance`, then `addCart`, `addCartConfirm`, `saveGenerateParentOrder`, and `payBalanceV2`.
- **Tracking.** The CJ order id is stored on the buyy order. Opening `/track` refreshes `GET /shopping/order/getOrderDetail`. The first time a tracking number appears, the store emails it.
- **If CJ create fails.** The Paystack order still stands. The shopper has paid buyy. `cjStatus` is `FAILED` and can be retried when verify runs again.

### Returns the shopper sees

- Damaged or wrong item: they write to buyy with photos. buyy refunds or replaces.
- Change of mind: a partial refund, and they keep the item. buyy does not ask them to mail it to China.
- Lost in transit: buyy follows the carrier and refunds or replaces when the shipment is confirmed lost.

### What stays internal

CJ's dispute center wants photos or a short video of the damage, plus a screenshot of the complaint that shows the date and the customer's name. A ruined item is a wallet refund or a free reship. A small flaw may be only a partial refund. The wrong size, the wrong product, or missing parts use the same proof, then a full refund or a replacement at CJ's cost.

CJ accepts physical returns at warehouses in China and advises against mailing goods back: the postage can cost more than the piece, and the parcel can take months. The usual practice is to let the customer keep it. A lost-package window depends on the destination. The published US example is 45 days after the parcel leaves the CJ warehouse. Do not promise that number on the Ghana storefront.

## Product buttons

Local product pages keep Add to bag and add Buy now, which bags the piece and opens `/checkout`.

CJ product pages require a variant, then offer the same two buttons. Other CJ cards stay links to the product page.
