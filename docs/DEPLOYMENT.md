# Deployment & Operations

## 1. Frontend — Vercel

1. Import the repository in Vercel (**Framework: Vite**, root `./`).
2. Build settings are committed in `vercel.json`:
   - Build: `npm run build` (runs `tsc && vite build`) · Output: `dist`
   - SPA rewrite: all routes → `/index.html`
   - Security headers (`nosniff`, `SAMEORIGIN`, strict referrer policy)
   - Long-cache for `/assets/*`, 1-day cache for `/images/*`
3. Set **Environment Variables** (Preview + Production):
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (required)
   - `VITE_SITE_URL` = your production origin, e.g. `https://vachomaempire.com`
   - `VITE_BUSINESS_PHONE` = WhatsApp number without `+` (enables WhatsApp CTAs)
   - Optional: `VITE_BUSINESS_EMAIL`, `VITE_BUSINESS_ADDRESS`, `VITE_BUSINESS_HOURS_*`,
     `VITE_DELIVERY_FEE_NGN`
4. Deploy. Every push to `main` redeploys production; pull requests get previews.
5. If the production domain differs from `vachomaempire.com`, also update:
   - `public/sitemap.xml` URLs, `public/robots.txt` sitemap line, and the canonical /
     JSON-LD URLs in `index.html`.

### Rollback
Vercel keeps every deployment — roll back with one click (Deployments → … → Promote).
Frontend-only change, no migrations involved, so rollback is always safe.

## 2. Backend — Supabase

The database, auth and storage already exist in the linked Supabase project. After any
fresh project restore, verify the following.

### 2a. Required tables & buckets
Tables (all in `public`): `profiles`, `customers`, `fashion_designs`,
`fashion_collections`, `collection_designs`, `fashion_orders`, `fashion_order_items`,
`fashion_inventory`, `custom_order_submissions`, `menu_items`, `food_orders`,
`food_order_items`, `food_specials`, `food_inventory`, `transactions`,
`income_categories`, `expense_categories`.

Storage buckets: `profile-images`, `custom-order-images` (both public-read).

### 2b. Row-Level Security (required)
The app uses the **anon key** from the browser, so RLS is the real authorization layer.
Apply and adapt the following in the Supabase SQL editor (review carefully — policies
are security-critical):

```sql
-- ── Helper: is the caller staff? ─────────────────────────────
create or replace function public.is_staff()
returns boolean language sql stable as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'manager', 'staff')
  );
$$;

-- ── Public catalogue (read-only) ─────────────────────────────
create policy "Public can browse menu" on public.menu_items
  for select using (available = true);
create policy "Public can browse published designs" on public.fashion_designs
  for select using (status = 'approved');
create policy "Public can browse active collections" on public.fashion_collections
  for select using (is_active = true);
create policy "Public can browse collection links" on public.collection_designs
  for select using (true);
create policy "Public can browse specials" on public.food_specials
  for select using (available = true);

-- ── Public ordering (insert-only, no reads of others' data) ──
create policy "Anyone can place food orders" on public.food_orders
  for insert with check (true);
create policy "Anyone can add food order lines" on public.food_order_items
  for insert with check (true);
create policy "Anyone can request custom designs" on public.custom_order_submissions
  for insert with check (true);

-- ── Customers read their own data ────────────────────────────
create policy "Customers read own food orders" on public.food_orders
  for select using (auth.uid() = customer_id);
create policy "Customers read own custom requests" on public.custom_order_submissions
  for select using (email = (auth.jwt() ->> 'email'));

-- ── Profiles: users manage their own row ─────────────────────
create policy "Users read own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users update own profile" on public.profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id);

-- ── Staff: full access to operational tables ─────────────────
-- Repeat for: menu_items, food_orders, food_order_items, food_specials,
-- fashion_designs, fashion_collections, collection_designs, fashion_orders,
-- fashion_order_items, custom_order_submissions, customers, transactions,
-- income_categories, expense_categories, food_inventory, fashion_inventory
create policy "Staff manage menu items" on public.menu_items
  for all using (public.is_staff()) with check (public.is_staff());
-- … (repeat per table)

-- ── Storage ──────────────────────────────────────────────────
-- Buckets are public for reads (covers <img> tags). Writes:
create policy "Anyone can upload custom-order references"
  on storage.objects for insert with check (bucket_id = 'custom-order-images');
create policy "Users can upload own avatar"
  on storage.objects for insert with check (
    bucket_id = 'profile-images' and auth.uid()::text = (storage.foldername(name))[1]
  );
```

> Also create the standard "new user gets a profile row" trigger if it doesn't exist
> (insert into `profiles` on `auth.users` insert, default role `'customer'`) — the app
> expects `profiles.id = auth user id`.

### 2c. Auth settings (Supabase dashboard)
- **Auth → URL Configuration → Redirect URLs:** add
  `https://<your-domain>/reset-password` (and `http://localhost:8080/reset-password`
  for local dev) so password-recovery links land on the reset page.
- Email confirmation: leave enabled (signup tells users to verify their email).

## 3. Post-deploy checklist

- [ ] Home, menu, portfolio, collections, specials load with live Supabase data
- [ ] Guest food order reaches the Food Dashboard; status changes reflect for signed-in buyers
- [ ] Custom fashion request (with photo) reaches the Fashion Dashboard
- [ ] `/admin` admits staff, rejects customer accounts with a clear message
- [ ] `/dashboard`, `/customers`, `/reports`, `/settings` load for permitted roles
- [ ] `/forgot-password` email arrives; reset link opens `/reset-password`
- [ ] `https://<domain>/sitemap.xml` and `/robots.txt` serve correctly
- [ ] Submit the sitemap in Google Search Console; request indexing for `/`

## 4. Day-to-day operations

| Task | Where |
|---|---|
| Publish/hide a dish | Food Dashboard → Menu Management (`available` flag) |
| Publish/hide a design | Fashion Dashboard → Designs (`approved` status) |
| Publish/hide a collection | Fashion Dashboard → Collections tab |
| Run a deal | Supabase `food_specials` row (`available`, dates, price) |
| Triage custom requests | Fashion Dashboard → Custom Orders (status dropdown) |
| Fulfil food orders | Food Dashboard → Orders (status dropdown) |
| Change delivery fee / hours / phone | Vercel env vars → redeploy |
| Add a staff member | Supabase `profiles` row → set `role` to staff/manager/admin |

## 5. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Blank catalogue pages / "Failed to load…" toasts | RLS blocking anon `select` | Apply §2b catalogue policies |
| Order submit fails | RLS blocking anon `insert` | Apply §2b insert policies |
| Staff login says "couldn't verify staff role" | Missing `profiles` row or role | Create row with `id` = auth user id, set role |
| Reset-password link goes nowhere | Redirect URL not allow-listed | Add it per §2c |
| Images don't upload | Bucket missing or storage policy | Create bucket + §2b storage policies |
| Deep link 404s on refresh | Missing SPA rewrite | `vercel.json` is committed — verify it deployed |
| Wrong canonical domain in Google | `VITE_SITE_URL` unset | Set to production origin, redeploy |

## 6. Backups
Supabase Pro/Team includes daily Postgres backups (see project settings). Uploads in
Storage should additionally be covered by the project's backup policy; the staff
 guide above keeps operational data entry inside Supabase so nothing lives only in
a browser.
