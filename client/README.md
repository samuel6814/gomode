# buyy storefront

The shop and the admin UI. Vite serves this app on port 5173 and talks to the API in `../server`.

<p>
  <img src="https://img.shields.io/badge/React-18-black?logo=react&logoColor=white" alt="React 18" />
  <img src="https://img.shields.io/badge/Vite-7-black?logo=vite&logoColor=white" alt="Vite 7" />
  <img src="https://img.shields.io/badge/styled--components-6-black?logo=styledcomponents&logoColor=white" alt="styled-components" />
  <img src="https://img.shields.io/badge/TanStack_Query-5-black?logo=reactquery&logoColor=white" alt="TanStack Query" />
  <img src="https://img.shields.io/badge/Paystack-inline-black" alt="Paystack inline" />
</p>

## Stack

- React 18 and Vite 7
- styled-components for layout. Corners are square. Type is Inter, with Archivo Black for the wordmark.
- React Router 7
- TanStack Query and axios for the API
- Paystack inline on checkout
- Better Auth client for sign-in

## Scripts

```bash
npm install
npm run dev       # http://localhost:5173
npm run build
npm run preview
```

Open the dev shop at `http://localhost:5173`. The API allows that origin in development. `http://127.0.0.1:5173` is blocked by CORS, so the homepage looks empty even when the API is up.

## Environment

Copy `.env.example` to `.env`.

| Name | Use |
| --- | --- |
| `VITE_API_URL` | API base. Local value is `http://localhost:5000/api`. |
| `VITE_PAYSTACK_PUBLIC_KEY` | Public key passed to the Paystack popup. |

## Pages

The public shell (`StoreShell`) wraps the shop. Auth screens and the admin layout sit outside it.

| Path | Who |
| --- | --- |
| `/` | Homepage: wordmark, search, categories, sale banner, rails, Knits bento |
| `/shop`, `/product/:id` | Catalog grid and product page |
| `/cart`, `/checkout` | Bag and Paystack checkout, including guests |
| `/order-confirmation/:id` | Confirmation after payment |
| `/track` | Order number plus email |
| `/wishlist`, `/profile`, `/orders` | Signed-in account |
| `/admin/sales` and the other `/admin/*` screens | Admin only |

The cart drawer opens from the rail, the mobile menu, and the bag button on the right. **View full bag** goes to `/cart`. **Checkout** goes to `/checkout`.

Guest bag data lives in `localStorage` under `buyy-guest-cart`. Signing in merges it into the account cart.

Catalog photos are static files in `public/new-items/`. The API stores the public path.
