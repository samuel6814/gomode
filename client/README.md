# GoMode Storefront

The storefront and admin UI. Vite serves this app on port 5173 and communicates with the backend API in `../server`.

<p>
  <img src="https://img.shields.io/badge/React-18-black?logo=react&logoColor=white" alt="React 18" />
  <img src="https://img.shields.io/badge/Vite-7-black?logo=vite&logoColor=white" alt="Vite 7" />
  <img src="https://img.shields.io/badge/styled--components-6-black?logo=styledcomponents&logoColor=white" alt="styled-components" />
  <img src="https://img.shields.io/badge/TanStack_Query-5-black?logo=reactquery&logoColor=white" alt="TanStack Query" />
  <img src="https://img.shields.io/badge/Paystack-inline-black" alt="Paystack inline" />
</p>

## Stack

- React 18 and Vite 7
- styled-components for layout, with `#668A53` accent and `#F5F3EF` stone canvas.
- React Router 7
- TanStack Query v5 and Axios for API communications
- Paystack inline on checkout
- Better Auth client for authentication

## Scripts

```bash
npm install
npm run dev       # http://localhost:5173
npm run build
npm run preview
```

Open the storefront at `http://localhost:5173`.

## Environment

Copy `.env.example` to `.env`.

| Name | Use |
| --- | --- |
| `VITE_API_URL` | API base. Local value is `http://localhost:5000/api`. |
| `VITE_PAYSTACK_PUBLIC_KEY` | Public key passed to the Paystack popup. |

## Pages

The public shell (`StoreShell`) wraps the shop with the text-based `gomode` logo.

| Path | Who | Description |
| --- | --- | --- |
| `/` | Public | Homepage: bold typographic hero, live ticker, categories, archive |
| `/shop`, `/product/:id` | Public | Apparel catalog grid and product details |
| `/cart`, `/checkout` | Public | Bag and Paystack checkout, supporting guests and registered users |
| `/order-confirmation/:id` | Public | Confirmation after payment |
| `/track` | Public | Real-time order tracking with status timeline |
| `/wishlist`, `/profile`, `/orders` | Users | Signed-in account center |
| `/admin/*` | Admin | Comprehensive dashboard, inventory, orders, flash sales |

Catalog photos are static files in `public/new-items/` with Cloudinary support.
