# Vachoma Empire — Fashion Atelier & Bole Kitchen

**Vachoma Empire** is a dual-business web application for a Port Harcourt, Nigeria brand:

- **Fashion atelier** — portfolio, themed collections, and made-to-measure custom order requests with measurements, budgets, timelines and reference-photo uploads.
- **Bole kitchen** — authentic Bole food menu (roasted plantain, yam, sweet potatoes, smoked fish, palm-oil pepper sauce), online ordering for dine-in / takeaway / delivery, and time-bound special offers.

It ships with a public customer website, customer accounts with order tracking, and a staff management system (dashboards, customers, reports, settings).

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite 5, Tailwind CSS, shadcn/ui (Radix) |
| Backend | Supabase (Postgres, Auth, Storage) |
| Forms & validation | React Hook Form + Zod |
| Charts | Recharts (admin reports) |
| Hosting | Vercel (static SPA + rewrites) |

> **Architecture decision:** the existing Supabase backend (auth, relational data, row-level security, file storage) is kept intentionally — migrating to another platform would discard working production infrastructure for no product benefit. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Quick start

```sh
# 1. Install dependencies (Node 20+)
npm install

# 2. Configure environment
cp .env.example .env
# → fill in VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY (Supabase → Settings → API)
# → set VITE_BUSINESS_PHONE to enable WhatsApp CTAs (e.g. 2348012345678)

# 3. Run locally
npm run dev        # → http://localhost:8080
```

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Local development server |
| `npm run build` | Type-safe production build (`tsc` + `vite build`) |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint (must report 0 errors) |

## Key routes

| Route | Audience | Purpose |
|---|---|---|
| `/` | Public | Home — brand story, both businesses, ordering CTAs |
| `/food-menu`, `/food-order`, `/food-specials` | Public | Menu, checkout, deals (shared cart) |
| `/fashion-portfolio`, `/fashion-collections`, `/fashion-custom-orders` | Public | Portfolio, collections, custom requests |
| `/about`, `/contact` | Public | Story, WhatsApp/email contact |
| `/login`, `/signup`, `/forgot-password`, `/reset-password` | Public | Customer auth |
| `/client/dashboard`, `/client/profile` | Customers | Order tracking, profile & measurements |
| `/admin` | Staff | Staff sign-in (role-gated) |
| `/dashboard`, `/fashion`, `/food` | Staff | Business dashboards |
| `/customers`, `/reports`, `/settings` | Staff | CRM, analytics, account & config |

## Project structure

```
src/
├── components/
│   ├── admin/        # Staff forms (menu items, fashion designs)
│   ├── auth/         # ProtectedRoute (auth + role gate)
│   ├── fashion/      # Custom-order helpers (upload preview, guides)
│   ├── layout/       # AppLayout (staff shell), ClientLayout (public shell)
│   ├── ui/           # shadcn/ui primitives
│   └── Seo.tsx       # Per-page title/meta/canonical/social manager
├── context/          # AuthContext (single auth subscription), CartContext (persistent cart)
├── hooks/            # Supabase data hooks (menu, designs, orders, profile, …)
├── integrations/
│   └── supabase/     # Typed Supabase client + generated Database types
├── lib/              # site.ts (business config, NGN formatting, WhatsApp links)
├── pages/
│   ├── client/       # Public + customer pages
│   ├── Customers.tsx # Staff CRM · Reports.tsx · Settings.tsx · dashboards
│   └── Index.tsx     # Staff entrance (/admin)
public/
├── images/           # Real business photography (curated subset used on site)
├── robots.txt        # Allows public pages, blocks admin/auth/client routes
└── sitemap.xml       # Indexable URLs (update domain if it changes)
```

## Environment variables

All configuration lives in `.env` (see [.env.example](.env.example)):

| Variable | Required | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase publishable (anon) key |
| `VITE_SITE_URL` | No | Canonical site URL (defaults to `https://vachomaempire.com`) |
| `VITE_BUSINESS_PHONE` | No | WhatsApp number, intl format without `+` — enables WhatsApp CTAs |
| `VITE_BUSINESS_EMAIL` | No | Contact email |
| `VITE_BUSINESS_ADDRESS` | No | Display address |
| `VITE_BUSINESS_HOURS_*` | No | Opening hours lines |
| `VITE_DELIVERY_FEE_NGN` | No | Flat delivery fee in NGN (default 1000) |

## Documentation

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — system design, data model, auth model, ADRs
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — Vercel + Supabase setup, RLS policies, operations

## SEO

- Unique titles/descriptions + canonicals per public page (`Seo` component)
- Static `sitemap.xml` (pages + images) and restrictive `robots.txt`
- JSON-LD `Restaurant` + `ClothingStore` + `WebSite` graph in `index.html`
- Private routes (`/admin`, `/dashboard`, `/client/*`, auth) are `noindex` + disallowed
