<div align="center">
  <img src="client/public/logo-nobg.png" alt="GoMode Logo" width="160" />
  <h1>GoMode</h1>
  <p><strong>Curated Streetwear, Fresh Kicks & Contemporary Footwear Culture</strong></p>
  
  <p>
    <a href="https://skillicons.dev">
      <img src="https://skillicons.dev/icons?i=react,vite,nodejs,express,prisma,postgres,redis,tailwind,vercel&theme=dark" alt="React, Vite, Node.js, Express, Prisma, PostgreSQL, Redis, Tailwind, Vercel" />
    </a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-18-668A53?logo=react&logoColor=white" alt="React 18" />
    <img src="https://img.shields.io/badge/Vite-7-668A53?logo=vite&logoColor=white" alt="Vite 7" />
    <img src="https://img.shields.io/badge/styled--components-6-668A53?logo=styledcomponents&logoColor=white" alt="styled-components" />
    <img src="https://img.shields.io/badge/Express-5-668A53?logo=express&logoColor=white" alt="Express 5" />
    <img src="https://img.shields.io/badge/Prisma-6-668A53?logo=prisma&logoColor=white" alt="Prisma 6" />
    <img src="https://img.shields.io/badge/PostgreSQL-Neon-668A53?logo=postgresql&logoColor=white" alt="PostgreSQL on Neon" />
    <img src="https://img.shields.io/badge/Auth-Better%20Auth-668A53" alt="Better Auth" />
    <img src="https://img.shields.io/badge/Currency-GH₵%20(GHC)-668A53" alt="Currency GHC" />
    <img src="https://img.shields.io/badge/Deployment-Vercel%20%2B%20Render-668A53" alt="Vercel + Render" />
  </p>
</div>

---

## Overview

**GoMode** is an elevated, streetwear-focused e-commerce destination dedicated to curated sneakers and contemporary footwear culture in West Africa and beyond. Combining limited-release drops, ergonomic artisanal craftsmanship, and modern digital commerce, the platform delivers a seamless collector shopping journey.

### Brand Aesthetic
- **Canvas**: Warm stone canvas (`#F5F3EF`)
- **Accent Color**: Signature Green (`#668A53`)
- **Typography**: Bold, high-impact display typography (`Plus Jakarta Sans`) paired with modern body typography (`Inter`)
- **Dividers & Borders**: Clean stone lines (`#E5E2DB`)
- **Identity**: Minimalist brand mark navigation utilizing `logo-nobg.png`

---

## Features

### Storefront Experience
- **Editorial Hero Section**: Bold headline (**"fresh kicks"** with "kicks" highlighted in `#668A53`), layered over the centerpiece `sneaker-garden-bg.png` visual.
- **Architectural Marquee**: Continuous live ticker showcasing curated releases and quality standards.
- **Curated Category Grid**: Visual exploration across *Sneakers*, *Clogs & Slip-Ons*, *Sandals*, and *Slip-Ons & Flats*.
- **Collection Archive**: Filterable catalog of curated footwear pieces with real-time stock, EU 38–45 sizing indicators, and instant quick-bag interactions.
- **Craft & Heritage Story**: Rich split-narrative highlighting authentic materials, ergonomic orthotic tooling, and small-batch curation.
- **Verified Collector Reviews**: Testimonial section with 5-star ratings, purchaser verification badges, and authentic customer endorsements.
- **Trust & Logistics Pillars**: Clear guarantees for Next-Day Greater Accra Delivery, 30-Day Complimentary Size Exchanges, and Authenticity Assurances.
- **VIP Registry**: Newsletter subscription for private releases and exclusive small-batch drops.

### Shopping & Checkout
- **Currency**: All pricing native in Ghana Cedis (`GH₵` / GHC).
- **Cart & Bag**: Saved cart for authenticated collectors; seamless guest cart with automatic account merge upon sign-in.
- **Payments**: Paystack checkout supporting Mobile Money (MTN, Telecel, AT) and card transactions.
- **Order Tracking**: Real-time order lookup and fulfillment status timeline at `/track`.

### Comprehensive Admin Suite
- **Control Dashboard**: Metric cards, customer acquisition tracking, and sales analytics charts.
- **Catalog Management**: Add, update, and manage footwear pieces, size variants, stock thresholds, and categories.
- **Logistics**: Regional delivery rate configuration across all 16 regions of Ghana.
- **Timed Promotions**: Flash sale engine with automated percentage discounts and countdown banners.

---

## Reverse Proxy & Authentication Architecture

When deploying the frontend on **Vercel** (`https://sneakergarden.vercel.app`) and backend API on **Render** (`https://sneakergarden-api.onrender.com`), modern browsers block third-party cross-origin cookies.

GoMode solves this through an Edge Reverse Proxy in `client/vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://sneakergarden-api.onrender.com/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
All browser requests travel to `/api/...` on the same domain, guaranteeing that cookies (`sameSite: 'lax'`, `secure: true`, `httpOnly: true`) are preserved and treated as first-party by Safari ITP, Google Chrome, and iOS devices.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 7, styled-components, Lucide Icons, React Router 7 |
| **Data Fetching** | TanStack Query v5, Axios |
| **Backend API** | Node.js (v20+), Express 5 |
| **Database & ORM** | Neon Serverless PostgreSQL, Prisma 6 |
| **Authentication** | Better Auth (session cookies, email/password) |
| **Payments** | Paystack inline checkout |
| **Asset Storage** | Cloudinary & local high-resolution webp assets |
| **Deployment** | Vercel (Frontend + Edge Rewrites), Render (API Web Service) |

---

## Local Development Setup

### Prerequisites
- Node.js `20.x` or higher
- PostgreSQL database (e.g. Neon connection string)

### 1. Backend Setup
```bash
cd server
cp .env.example .env
npm install
npx prisma db push
npm run dev
```

### 2. Database Seeding
To populate the footwear models, categories, Ghana delivery rates, and the admin account:
```bash
cd server
node scripts/seedFootwearCatalog.js
```
*Default Admin Credentials:* `admin@sneakergarden.com` / `Admin1234!`

### 3. Frontend Setup
```bash
cd client
cp .env.example .env
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Production Deployment

For complete, step-by-step instructions on deploying to **Vercel**, **Render**, and **Neon**, refer to the deployment manual:
👉 [**deployment.txt**](deployment.txt)

---

## License

Private repository — © 2024–2026 GoMode. All rights reserved.
