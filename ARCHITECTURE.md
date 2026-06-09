# Royal Furniture Pro — Frontend Foundation

Enterprise Next.js 15 App Router foundation. No ecommerce pages or business UI yet.

## Tech stack

| Layer              | Package                       |
| ------------------ | ----------------------------- |
| Framework          | Next.js 15 (App Router)       |
| Language           | TypeScript                    |
| Styling            | Tailwind CSS v4 + ShadCN UI   |
| Global state       | Redux Toolkit + Redux Persist |
| Server/async state | TanStack Query v5             |
| HTTP               | Axios                         |
| Local UI state     | Zustand                       |
| Forms              | React Hook Form + Zod         |
| Motion             | Framer Motion                 |
| Real-time          | Socket.IO Client (shell)      |
| Themes             | next-themes                   |
| Toasts             | react-hot-toast               |
| Icons              | Lucide React                  |

## Path aliases

`@/components`, `@/features`, `@/redux`, `@/services`, `@/hooks`, `@/lib`, `@/types`, `@/providers`, `@/config`, `@/utils`, `@/cache`, `@/styles`

## Route groups (empty — add pages later)

- `src/app/(storefront)` — catalog, PDP, cart checkout
- `src/app/(admin)` — dashboard
- `src/app/(auth)` — login/register
- `src/app/(marketing)` — CMS static pages

## Commands

```bash
cp .env.local.example .env.local
npm run dev
npm run build
npm run lint
npm run typecheck
```

## ShadCN

```bash
npx shadcn@latest add button
```

Components install to `src/components/ui/`.

## Next steps

1. Copy env example and set API/WS URLs
2. Add Redux slices under `src/redux/slices/`
3. Implement services + `hooks/api`
4. Add ShadCN components as needed
5. Build pages inside route groups only
