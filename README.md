# Terra 2.0

Private invite-only cannabis delivery web app. Built with Next.js App Router, tRPC, Drizzle ORM, and PostgreSQL.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 App Router |
| API | tRPC v11 + superjson |
| ORM | Drizzle ORM (postgres.js) |
| Database | PostgreSQL 16 |
| Auth | Jose (HS256 JWT, httpOnly cookie) |
| UI | Tailwind CSS v4 + shadcn/ui |
| Cart | Zustand (localStorage) |
| SMS | Twilio (stubbed — logs to console) |

## Local development

### Prerequisites

- Docker Desktop
- Node 22

### 1. Environment

```bash
cp env.example .env
# Fill in JWT_SECRET — generate one with: openssl rand -base64 32
# Other values can stay as the defaults in env.example for local dev
```

### 2. Start the Docker stack

```bash
docker compose -f compose.yml -f compose.dev.yml up
```

This starts:
- `db` — PostgreSQL 16 on `localhost:5433`
- `app` — Next.js dev server on `localhost:3000`
- `pgadmin` — database UI on `localhost:5050`

### 3. Push schema and seed

In a second terminal (runs against the host-accessible port `5433`):

```bash
npx drizzle-kit push   # applies schema to the DB
npm run seed           # loads mock data
```

The seed is idempotent — safe to run multiple times.

### 4. Open the app

`http://localhost:3000`

---

## Test walkthrough

### Login

The app uses phone + 4-digit OTP. Twilio is stubbed — the OTP prints to the Next.js server terminal:

```
OTP for +14165550002: 7391
```

**Seeded test accounts** (enter digits only, no `+` or spaces):

| Name | Phone to type | Notes |
|---|---|---|
| John Doe | `14165550002` | Regular customer, 150 points |
| Jane Smith | `14165550003` | VIP customer, 500 points |

### Happy path

1. Log in with one of the numbers above
2. Browse the menu by category tab (Buds, Extracts, Edibles, Mushrooms, Dab Pod System)
3. Add items — cart badge in the header updates live
4. Go to `/cart` → Checkout
5. **Step 1** — pick a saved address (John has Home + Work, Jane has Home + Cottage)
6. **Step 2** — pick a delivery window (Mon–Fri, filtered to your address's district)
7. **Step 3** — pick a change amount ($5 / $10 / $15 / $20 / $25 / Other / No change)
8. **Step 4** — add special instructions → Place order
9. You land on the order detail page
10. `/profile` — view addresses, points balance, logout

### pgAdmin

`http://localhost:5050` — credentials are in your `.env` (`PGADMIN_EMAIL` / `PGADMIN_PASSWORD`).

Connect to server: host `db`, port `5432`, user/password/db from your `.env`.

---

## Scripts

```bash
npm run dev      # start Next.js dev server (used inside Docker)
npm run build    # production build
npm run seed     # seed the database with mock data
npx drizzle-kit push    # push schema changes to DB (dev)
npx drizzle-kit studio  # open Drizzle Studio (DB browser)
```

---

## Project structure

```
app/                        # Next.js App Router
  (customer)/               # Authenticated customer routes
    page.tsx                # Product menu
    cart/page.tsx           # Cart
    checkout/page.tsx       # 4-step checkout
    orders/page.tsx         # Order history
    orders/[id]/page.tsx    # Order detail
    profile/page.tsx        # Profile + addresses
  api/
    trpc/[trpc]/route.ts    # tRPC HTTP handler
    logout/route.ts         # Clears auth cookie
  login/page.tsx            # Phone + OTP login
  layout.tsx                # Root layout (fonts, providers)
  providers.tsx             # QueryClient + tRPC provider

components/
  Header.tsx                # Sticky nav with cart badge
  ProductCard.tsx           # Product row with add/qty controls

db/
  index.ts                  # Drizzle instance
  schema.ts                 # All table definitions

drizzle/                    # Migration output (drizzle-kit)

lib/
  store/cart.ts             # Zustand cart store
  trpc/client.ts            # tRPC React client
  trpc/shared.ts            # Base URL helper
  utils/delivery.ts         # Winnipeg timezone, window availability
  utils/discount.ts         # Effective price calculation

trpc/
  init.ts                   # initTRPC, createContext, protectedProcedure
  routers/
    _app.ts                 # Root router
    auth.ts                 # requestOtp, verifyOtp
    orders.ts               # Delivery schedules, order CRUD
    products.ts             # Product list, category groups
    users.ts                # me, addAddress

scripts/
  seed.ts                   # Idempotent seed script

middleware.ts               # JWT route guard
```

---

## Auth

- Phone + 4-digit OTP. No passwords.
- OTP stored on `users` table, 10-minute TTL, cleared on successful verify.
- JWT signed with HS256 via `jose`, 7-day expiry, stored in an `HttpOnly` cookie named `token`.
- All routes except `/login` and the two auth tRPC endpoints require a valid cookie.
- Customers cannot self-register — the admin pre-adds phone numbers.
