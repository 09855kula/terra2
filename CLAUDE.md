# Terra 2.0 — Agent Context

Private invite-only cannabis delivery web app. Rebuild of a legacy MongoDB/Telegram bot into a modern Next.js stack. Client project — ship fast, use best practices, always target the Docker stack.

---

## Hard Rules

- **Never** add `Co-authored-by: Claude` or any Anthropic/AI attribution to commits, PRs, or code comments
- **Always** target the Docker stack — `DATABASE_URL` inside containers uses service name `db`, not `localhost`
- **Never** use `localhost` for inter-service communication inside Docker
- **Best practices over legacy patterns** — old app code (`old app/`) is reference for requirements only, never for implementation
- Ask questions before opening a PR if requirements are unclear
- `tsc --noEmit` must pass before any PR is opened

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js App Router — `app/` at root, **not** `src/` |
| API | tRPC v11 with superjson transformer |
| ORM | Drizzle ORM (`drizzle-orm`, `postgres.js` driver) |
| Database | PostgreSQL 16 via Docker |
| Auth | Custom — `jose` (HS256 JWT, httpOnly cookie) |
| Validation | Zod |
| Forms | React Hook Form |
| UI | Tailwind CSS v4 + shadcn/ui |
| SMS | Twilio (stubbed with `console.log` — awaiting number from client) |
| Email | nodemailer / SMTP (future — account recovery) |
| Runtime | Node 22 Alpine (Docker) |

---

## Project Structure

```
app/
  (customer)/                # Customer-facing route group
    page.tsx                 # Menu / product browse
    cart/                    # Cart page
    checkout/                # 4-step checkout flow (address, window, change, confirm)
    orders/                  # Order history + orders/[id] detail
    profile/                 # Profile + saved addresses
    layout.tsx
  api/
    trpc/[trpc]/route.ts     # tRPC HTTP entry point
    users/route.ts           # Standalone POST user-creation route (NOT auth-gated — dev/test use only)
    logout/route.ts
  login/                     # Public login page (phone + OTP)
  layout.tsx
  page.tsx
db/
  index.ts                   # Drizzle instance (postgres.js driver)
  schema.ts                  # All table definitions + enums
drizzle/                     # Drizzle migration output (drizzle-kit)
drizzle.config.ts
trpc/
  init.ts                    # initTRPC, createContext, exports router + publicProcedure + protectedProcedure
  routers/
    _app.ts                  # Root router — merges users, auth, products, orders
    auth.ts                  # requestOtp, verifyOtp
    users.ts                 # users.create, users.me, users.addAddress
    products.ts               # products.list, products.groups, products.todayCalendar
    orders.ts                 # orders.create, getActive, getHistory, byId, cancel, getDeliverySchedules
scripts/
  seed.ts                    # Seeds all 12 tables with realistic mock data — npm run seed
lib/
  store/cart.ts               # Client-side cart state
  utils/discount.ts           # calcEffectivePrice (product/tier/sale-day discount) — VIP stacking is a TODO
  utils/delivery.ts           # Delivery window calculation from deliverySchedules
middleware.ts                # Route protection — lives at project root
old_app/                     # Legacy reference only — DO NOT use for implementation
  backend/                   # Old Django backend
  frontend-menu-web-app/     # Old frontend
public/
compose.yml                  # Base Docker services (db, volumes, network)
compose.dev.yml              # Dev overrides (app + pgadmin)
compose.prod.yml             # Prod overrides
Dockerfile                   # Multi-stage: deps -> builder -> runner
env.example                  # All required env vars documented
```

**Not built yet — no router or app route exists for any of these:**

- Admin (order management, product/inventory CRUD, category management, customer service tools, broadcast email)
- Driver views (the `drivers` table exists but nothing reads/writes it besides seed data)
- Points redemption (`orders.addGiftItem`, `isUsePoint` flow) — architecture resolved, not implemented
- `operatingCalendar.pointsMultiplier` admin controls

---

## Docker Stack

### Services

**compose.yml** (base — always included):

- `db` — postgres:16-alpine, port `5433:5432`, named volume `postgres_data`, network `terra`

**compose.dev.yml** (dev):

- `app` — builds from Dockerfile `deps` stage, runs `npm run dev`, mounts `.:/app`, port `3000:3000`
- `pgadmin` — dpage/pgadmin4, port `5050:80`

**compose.prod.yml** (prod):

- `app` — pulls from GHCR, runs standalone Next.js build

### Start commands

```bash
# Dev
docker compose -f compose.yml -f compose.dev.yml up

# Prod
docker compose -f compose.yml -f compose.prod.yml up -d
```

### Database URL

- **Inside Docker containers:** `postgresql://terra:changeme@db:5432/terra_db`
- **From host (CLI tools like drizzle-kit):** `postgresql://terra:changeme@localhost:5433/terra_db`
- `DATABASE_URL` in `.env` should use `@db` (the Docker service name) for container use

---

## Environment Variables

See `env.example` for all vars. Required ones:

```
POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_DB
DATABASE_URL          # uses @db inside Docker
JWT_SECRET            # generate: openssl rand -base64 32
TWILIO_ACCOUNT_SID    # stubbed until Travis provides number
TWILIO_AUTH_TOKEN
TWILIO_PHONE_NUMBER
PGADMIN_EMAIL
PGADMIN_PASSWORD
```

---

## Auth Design

- **Method:** Phone number + 4-digit OTP, no passwords
- **OTP:** Stored on `users` table (`otpCode`, `otpExpiresAt`), 10-minute TTL, cleared immediately after successful verify
- **Session:** JWT in httpOnly cookie named `token`
- **JWT:** Signed with HS256 via `jose`, 7-day expiry, payload `{ userId: number }`
- **Cookie flags:** `HttpOnly; Path=/; SameSite=Lax; Max-Age=604800` + `Secure` in production
- **SMS:** Twilio — currently `console.log` stub, drop-in replace when `TWILIO_PHONE_NUMBER` is set

### Auth flow

```
POST /api/trpc/auth.requestOtp  -> generate OTP, store on user, send SMS (stubbed)
POST /api/trpc/auth.verifyOtp   -> validate OTP, clear OTP, sign JWT, set cookie
middleware.ts                   -> verify cookie on every request, redirect to /login if invalid
```

### Public paths (no auth required)

```
/login
/api/trpc/auth.requestOtp
/api/trpc/auth.verifyOtp
```

---

## tRPC Setup

```
trpc/init.ts
  - createContext() -> { resHeaders: new Headers() }
  - initTRPC.context<Context>().create({ transformer: superjson })
  - exports: router, publicProcedure

trpc/routers/_app.ts
  - merges all sub-routers
  - exports: appRouter, AppRouter (type)

app/api/trpc/[trpc]/route.ts
  - fetchRequestHandler with createContext
  - exports GET, POST
```

The `fetchRequestHandler` adapter reads `ctx.resHeaders` and attaches them to the response automatically — no manual header copying needed.

---

## Schema Summary

Enums: `orderStatusEnum`, `productTypeEnum`, `unitOfMeasureEnum`

Tables:

- `districts` — delivery zones
- `users` — all user types (customer/driver/admin flags on same table), OTP fields, points, VIP
- `userAddresses` — multiple addresses per user, FK to districts
- `drivers` — driver profile, FK to users
- `categoryGroups` — product categories (Buds, Extracts, Edibles, etc.)
- `productTiers` — pricing tiers within a category
- `products` — individual products, FK to tiers
- `orders` — FK to users (snapshots districtId + address at order time)
- `orderItems` — line items, FK to orders + products
- `deliverySchedules` — driver/district/day/window assignments
- `operatingCalendar` — open/closed days, sale overrides, points multipliers
- `pointTransactions` — points ledger, FK to users

**Key decisions baked in:**

- No separate `customers` table — merged into `users` with role flags
- Discount logic: highest of product-level or tier-level wins — handled in app logic, not schema
- VIP is **NOT a price discount** — VIP customers earn extra points (multiplier TBD, ~1.5–2×). Points are the loyalty mechanism.
- Points redemption: 20 points = 1 free item (legacy rule; exact UX TBD for M4)
- Points earn cap per order: TBD (client to confirm)
- Cutoff times are per delivery schedule (`windowStart`), not a global setting — configurable via M6 admin
- Cancel: customers can cancel any `pending` order. Once status advances past pending, cancellation is blocked.
- Profile confirmed (`users.profileConfirmed`): new referred customers start `false`; admin reviews and flips to `true`. Unconfirmed users are **fully blocked at login** — `verifyOtp` throws FORBIDDEN before issuing the JWT. Error message: "Your account is pending approval."
- VIP multiplier: 1.5× points on earn (applied in `orders.create` when points earn logic is built in M4/M5)
- `orders.districtId` and `orders.address` are snapshots (historical accuracy)
- No job queue (BullMQ/Redis) — inline SMS/email is fine at ~70 orders/week

---

## Dockerfile Notes

- Multi-stage: `base` -> `deps` -> `builder` -> `runner`
- Dev compose uses `target: deps` stage with `npm run dev` + volume mount
- Prod uses `runner` stage (standalone Next.js output)
- `next.config.ts` has `output: "standalone"` — required for the prod Docker build
- **The Dockerfile currently has stale Prisma copy steps in the runner stage — remove them, Prisma is not used**
- Non-root user `nextjs:nodejs` in production

---

## Known Issues / Tech Debt

- `Dockerfile` runner stage copies Prisma artifacts that don't exist — Prisma has been fully dropped, fix when doing prod build work
- `compose.dev.yml` references `NEXTAUTH_URL` and `NEXTAUTH_SECRET` — replace with `JWT_SECRET`
- `env.example` says "Prisma connection string" — update the comment
- `app/api/users/route.ts` (standalone REST route for user creation) has no auth/admin gate — fine for local dev/testing, must not ship to prod unguarded on an invite-only app
- VIP stackable discount is unimplemented — literal `// TODO` in `lib/utils/discount.ts`, needs the % confirmed by Travis
- **Phone number country-code mismatch (login bug):** frontend (`app/login/page.tsx`) only requires 10+ digits before submitting; backend `normalizePhone` in `auth.ts` just prepends `+` to whatever digits it receives. Seeded/real phone numbers are stored with the country code (e.g. `+14165550003`, 11 digits). A user entering a 10-digit number (no leading `1`) passes frontend validation but gets normalized to the wrong number (`+4165550003`) and fails `NOT_FOUND` on `requestOtp`. Placeholder text implies a country code is needed but validation doesn't enforce it. Fix by either bumping frontend min-length to 11 and making the country code explicit in the input, or having `normalizePhone` try both the raw digits and a `1`-prefixed variant when looking up the user.
- `orders.total` and `orders.totalAfterDiscount` always end up equal, since discount is applied client-side in `ProductCard.tsx` before the item ever reaches the cart/order. No raw pre-discount subtotal is preserved. Not a blocker for customer-facing flow, but will need fixing before building the admin order-detail view, which expects to show raw total, discount %, and grand total separately.

---

## Milestones

| # | Name | Status |
|---|---|---|
| M0 | Infrastructure (Docker, repo, env) | Complete |
| M1 | Backend foundation (schema, tRPC, auth) | Complete |
| M2 | Seed data (all 12 tables) | Complete |
| M3 | Customer UI (menu, cart, checkout, orders, profile) | Complete — merged to `main`, verified end-to-end (seed runs clean, `tsc --noEmit` passes, full browse-to-order flow works against real data) |
| M4 | Cart & checkout — points redemption + admin points-multiplier controls | In progress — architecture resolved (gift item appends to existing order via `isUsePoint`, customer picks item, no auto-cheapest); not yet implemented |
| M5 | Order management (admin dashboard, driver views, customer messaging) | Not started |
| M6 | Admin tools (inventory, product/category mgmt, broadcast email, customer service tab) | Not started |
| M7 | Launch (security hardening, staging sign-off, DNS swap, credential handoff) | Not started |
| Post | Post-launch (invoicing/PnL stats) | Not started — scope TBD |

---

## Reference Material

Old app is in `old app/` — two projects:

- `old app/backend/` — Django backend (requirements reference only)
- `old app/frontend-menu-web-app/` — old frontend (UI/UX reference only)

Design specs (Figma exports) are in the Claude.ai project hub. Do not implement UI from the old frontend code — use the Figma specs as the source of truth for M3+.
