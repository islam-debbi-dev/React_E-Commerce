# ecom-dashboard

Admin dashboard for the e-commerce shop. Same theme and architecture as the
`himmob` dashboard: Next.js App Router, shadcn/ui, Tailwind v4, SWR, TypeScript.

## Requirements

The shop API must be running, otherwise the pages show an error card.

```sh
# terminal 1 - API on port 5001
cd ../backend && npm run dev

# terminal 2 - dashboard on port 3001
npm install
npm run dev
```

Open `http://localhost:3001`.

## Sign in

The dashboard has no user accounts. It is unlocked with the `ADMIN_KEY` from
`../backend/.env`:

```
ADMIN_KEY=your-key-here
```

The key is checked against the API, then stored in an `httpOnly` cookie for 7
days. `src/middleware.ts` redirects signed out visitors to `/login`, and
`src/lib/fetcher.ts` sends the API back to `/login` on any `401`, so rotating the
key signs everyone out.

## Environment

Copy `.env.example` to `.env.local`:

| Variable                | Purpose                                        |
| ----------------------- | ---------------------------------------------- |
| `API_URL`               | Server-only base URL, also used by server actions |
| `NEXT_PUBLIC_API_URL`   | Browser-visible base URL                        |
| `NEXT_PUBLIC_SHOP_NAME` | Name shown in the sidebar                       |
| `NEXT_PUBLIC_CURRENCY`  | Currency symbol, defaults to `$`               |

## Structure

```
types/            One file per resource: analytics, order, product
data/queries/     One custom SWR hook per resource
mutations/        Server actions ("use server") for writes
common/           Shared constants and server helpers
src/app/          Routes: /login and /dashboard/overview
src/components/
  ui/             shadcn/ui primitives
  layout/         Sidebar, header, nav
  auth/           Login form
  overview/       Cards and charts for the overview page
  shared/         Error card, empty state, responsive image
  table/          Search input, limit selector, pagination
src/lib/          fetcher, token reader, formatters
src/hooks/        Shared hooks
```

Follow `GEMINI.md` for the conventions: `@/` alias imports, feature folders,
one type file per resource, SWR for reads, server actions for writes, and the
admin copywriting rules.

## API it consumes

| Endpoint                | Used for                                        |
| ----------------------- | ----------------------------------------------- |
| `GET /analytics/overview` | Stat cards, sales trend, status, channels, best sellers, recent orders |
| `GET /orders`           | Orders list, ready for the orders page           |
| `GET /orders/:id`       | Order detail                                     |
| `GET /products`         | Product list, ready for the products page        |

All of them are protected by `ADMIN_KEY` on the API side and expect the header
`Authorization: Bearer <ADMIN_KEY>`.

## Notes

- `src/instrumentation.ts` swaps in an in-memory `localStorage` when the Node
  runtime exposes a Web Storage implementation that throws. Without it, server
  rendering crashes on Node 24 and newer.
- Cancelled orders are excluded from revenue.
- Revenue change compares the last 14 days with the 14 days before that.