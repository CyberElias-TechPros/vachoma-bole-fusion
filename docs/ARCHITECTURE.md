# Architecture

## System overview

```
                    USERS (customers + staff)
                              │
                              ▼
                    ┌────────────────────┐
                    │  Vercel — static   │
                    │  React SPA (Vite)  │
                    └─────────┬──────────┘
                              │ HTTPS (Supabase client libs)
                              ▼
              ┌───────────────────────────────┐
              │  Supabase                     │
              │  ├── Postgres (RLS)            │
              │  ├── Auth (email/password)     │
              │  └── Storage (images)          │
              └───────────────────────────────┘
```

There is no custom API server. The React app talks to Supabase directly using the
publishable key; **authorization is enforced by Postgres Row-Level Security (RLS)**,
never by the frontend. The frontend's role checks are UX conveniences only.

## Why Supabase was kept (ADR-001)

**Context:** the repository arrived with a fully modelled Supabase backend — 17 tables,
auth, and storage buckets — already wired into every workflow.

**Decision:** keep Supabase as the backend; host only the frontend on Vercel. No
Cloudflare Workers / D1 / R2 / KV / Queues / Cron were introduced.

**Rationale:**
- Auth, RLS, relational queries and file uploads already work; a migration would be
  high-risk with zero user-facing benefit.
- Nothing in the workload needs edge compute, key-value caching, realtime
  coordination, or background queues.
- The simplest architecture that satisfies the requirements wins.

**Consequences:** operational surface is Vercel + Supabase only. If future needs
(webhooks, scheduled jobs, secret-bearing integrations) arise, a small service layer
can be added then — not before.

## Data model (Supabase Postgres)

### Fashion
- `fashion_designs` — portfolio pieces (`status`: draft → in-review → approved → archived).
  Only `approved` rows are shown publicly.
- `fashion_collections` + `collection_designs` (join) — themed/seasonal edits.
  Only `is_active` collections are shown publicly.
- `custom_order_submissions` — public custom-request form posts (measurements, budget,
  reference image URLs). Staff advance `status`: submitted → reviewed → accepted →
  in-progress → completed / rejected.
- `fashion_orders` + `fashion_order_items`, `fashion_inventory` — staff-side records.

### Food
- `menu_items` — dishes (`available` flag gates public visibility).
- `food_orders` + `food_order_items` — public checkout inserts; `customer_id` is set
  when the buyer is signed in so orders appear in `/client/dashboard`.
- `food_specials` — time-bound deals, optionally linked to a `menu_item`.
- `food_inventory` — staff-side records.

### Shared
- `profiles` — one row per auth user (`role`: admin | manager | staff | customer).
- `customers` — staff CRM shared across both businesses.
- `transactions`, `income_categories`, `expense_categories` — lightweight ledger feeding Reports.

### Storage buckets
- `profile-images` — staff/customer avatars (≤2MB, images only).
- `custom-order-images` — custom-request reference photos (≤5 files, ≤5MB each, images only).

## Auth & authorization

- **Sign-up / sign-in:** Supabase email+password. Customers land in their dashboard.
- **Staff entrance (`/admin`):** real Supabase sign-in, then a server-side profile-role
  check. Non-staff accounts are signed straight back out with an explanation.
- **Route guards:** `ProtectedRoute` requires authentication, then optionally a role
  allow-list (`admin`, `manager`, `staff`, `customer`).
- **Single session source:** `AuthProvider` owns the one `onAuthStateChange`
  subscription; `useProfile(user)` reuses it (no duplicate listeners).
- **Server-side enforcement:** RLS policies are the real gatekeepers — see
  [DEPLOYMENT.md](DEPLOYMENT.md) for the required policy set.

### Roles
| Role | Website | Staff dashboards | Customers/Reports/Settings |
|---|---|---|---|
| customer | full | — | — |
| staff | full | fashion, food | customers, settings |
| manager | full | all incl. overview | all |
| admin | full | all incl. overview | all |

## Frontend architecture

- **Routing:** `react-router-dom` with route-level `React.lazy` code splitting; each
  page is its own chunk (`Suspense` fallback while loading). SPA fallback is
  configured in `vercel.json` so deep links work in production.
- **State:**
  - Server state via focused Supabase hooks (`use-menu-items`, `use-fashion-designs`,
    `use-food-orders`, …) — each owns fetch + mutations + toasts.
  - Food cart in `CartContext`, persisted to `localStorage` and shared by the menu,
    specials and checkout pages (previously three disconnected carts).
  - Portfolio favourites in `localStorage`.
- **Forms:** React Hook Form + Zod everywhere; file inputs validated client-side
  (type + size + count) before upload.
- **SEO:** static defaults + JSON-LD in `index.html`; the `Seo` component keeps
  title/meta/canonical/social tags in sync per route. Admin/auth/client routes are
  `noindex` and disallowed in `robots.txt`. Static `sitemap.xml` covers indexable URLs.
- **Styling:** Tailwind + shadcn/ui on a dark-brown/gold brand theme; `prefers-reduced-motion`
  respected; skip-link + visible focus + semantic landmarks for accessibility.

## Key flows

### Food order (guest or signed-in)
Menu/Specials → shared cart → `/food-order` (type, contact, address) →
`food_orders` + `food_order_items` insert → confirmation with order reference →
staff advances status in Food Dashboard → (signed-in) customer tracks it in
`/client/dashboard`.

### Custom fashion request
Portfolio/Collections (`?design=` pre-fill) → multi-section form (contact, design,
size/measurements, budget/timeline, delivery) → reference photos to Storage →
`custom_order_submissions` insert → success panel → staff triages in Fashion Dashboard.

### Contact
The form opens **WhatsApp** with the message pre-filled when `VITE_BUSINESS_PHONE`
is set, otherwise the visitor's email app via `mailto:`. Either way the message
genuinely leaves the browser — nothing is simulated.

## Non-goals (deliberately not built)

- Online payments (pay on pickup/delivery — matches how the business operates).
- Email/SMS notifications (no provider credentials exist; order confirmation happens by phone).
- Realtime order tracking, multi-branch, inventory automation, loyalty — no evidence
  of need; documented here so they aren't mistaken for oversights.
