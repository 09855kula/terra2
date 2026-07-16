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
app/                        # Next.js App Router pages & API routes
  api/trpc/[trpc]/route.ts  # tRPC HTTP entry point
  login/                    # Public login page (phone + OTP)
  layout.tsx
  page.tsx
db/
  index.ts                  # Drizzle instance (postgres.js driver)
  schema.ts                 # All table definitions + enums
drizzle/                    # Drizzle migration output (drizzle-kit)
drizzle.config.ts
trpc/
  init.ts                   # initTRPC, createContext, exports router + publicProcedure
  routers/
    _app.ts                 # Root router — merge all sub-routers here
    auth.ts                 # requestOtp, verifyOtp
    users.ts                # users.create (and future CRUD)
middleware.ts               # Route protection — lives at project root
old app/                    # Legacy reference only — DO NOT use for implementation
  backend/                  # Old Django backend
  frontend-menu-web-app/    # Old frontend
public/
compose.yml                 # Base Docker services (db, volumes, network)
compose.dev.yml             # Dev overrides (app + pgadmin)
compose.prod.yml            # Prod overrides
Dockerfile                  # Multi-stage: deps -> builder -> runner
env.example                 # All required env vars documented
```

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

- `db/index.ts` has a `console.log("DATABASE_URL: ...")` — remove before M2
- `Dockerfile` runner stage copies Prisma artifacts that don't exist — fix when doing prod build work
- `compose.dev.yml` references `NEXTAUTH_URL` and `NEXTAUTH_SECRET` — replace with `JWT_SECRET`
- `env.example` says "Prisma connection string" — update the comment
- OTP is 6 digits in current `auth.ts` code (`100000 + Math.random() * 900000`) — should be 4 digits to match original UX (`1000 + Math.random() * 9000`)
- `verifyOtp` references undefined `secret` variable — broken, needs fix (see M1 tasks)

---

## Milestones

| # | Name | Status |
|---|---|---|
| M0 | Infrastructure (Docker, repo, env) | Complete |
| M1 | Backend foundation (schema, tRPC, auth) | In progress |
| M2 | Data migration (MongoDB -> Postgres) | In Progress |
| M3 | UI rebuild (VPS provisioning at start) | Pending |
| M4 | Cart & checkout | Pending |
| M5 | Order management | Pending |
| M6 | Admin tools | Pending |
| M7 | Launch | Pending |
| Post | Post-launch | Pending |

---

## M1 Remaining Tasks (current branch: `feat/complete-m1-auth`)

- [ ] `trpc/init.ts` — add `createContext` returning `{ resHeaders: new Headers() }`, wire into `initTRPC.context<Context>()`
- [ ] `trpc/routers/auth.ts` — fix `verifyOtp`: define `secret`, add `ctx` to mutation signature, set httpOnly cookie via `ctx.resHeaders.set('Set-Cookie', ...)`
- [ ] `trpc/routers/_app.ts` — add `authRouter` to root router
- [ ] `app/api/trpc/[trpc]/route.ts` — import and pass `createContext` to `fetchRequestHandler`
- [ ] `middleware.ts` — create at project root, protect all routes except public paths
- [ ] `app/login/page.tsx` — stub login page (prevents middleware redirect loop)
- [ ] `compose.dev.yml` — replace `NEXTAUTH_URL`/`NEXTAUTH_SECRET` with `JWT_SECRET`
- [ ] `env.example` — fix "Prisma connection string" comment
- [ ] `Dockerfile` — remove stale Prisma copy steps from runner stage
- [ ] `db/index.ts` — remove `console.log` of DATABASE_URL
- [ ] Fix OTP to 4 digits in `auth.ts`
- [ ] `tsc --noEmit` passes clean

---

## Reference Material

Old app is in `old app/` — two projects:

- `old app/backend/` — Django backend (requirements reference only)
- `old app/frontend-menu-web-app/` — old frontend (UI/UX reference only)

Design specs (Figma exports) are in the Claude.ai project hub. Do not implement UI from the old frontend code — use the Figma specs as the source of truth for M3+.
