# Frontend Guidelines

## Project Overview

- This project is a **single-page admin dashboard** for a real estate platform, similar to Airbnb.
- You are working on the **frontend only** — the backend is external and will be integrated via APIs.
- The dashboard is intended for **admin users only**.
- Everything is secured behind authentication (to be added later).
- Focus on a **modular**, **well-typed**, and **highly maintainable** codebase.

## Admin Capabilities

- View, edit, activate, deactivate, and delete users and properties.
- Interact with external data using forms, modals, tables, and filters.
- Use **dummy data per feature** until APIs are connected.

---

# Tech Stack Guidelines

## Next.js (App Router)

- Use Next.js with the **App Router** exclusively.
- Pages and layouts live inside `/app`.
- Always use `@/` alias imports — never `../`, `./`, or relative dot paths.
- Global styles live in `/app/globals.css`.

## Shadcn UI Components

- Use Shadcn UI for all interface elements.
- Stick to the **default theme** unless specifically overridden.
- Extend components via composition — don’t build from scratch.
- All components must be **responsive**, **accessible**, and **typed**.
- Use **Lucide Icons** for all iconography.

## Tailwind CSS

- Use **Tailwind CSS only** for all styling.
- Avoid inline styles or traditional CSS.
- Use utility classes for spacing, layout, responsiveness.
- Follow **mobile-first** principles.
- Don’t override the Tailwind config unless necessary.

## SWR (Data Fetching)

- Use **SWR** for all data fetching and caching.
- Create a **custom hook per resource** (e.g., `useUsers`, `useProperties`).
- Do not fetch directly inside components.
- Use optimistic updates and fallback data when necessary.
- Until APIs are available, use dummy data scoped to the feature.

## TypeScript (Strict)

- Everything must be written in **TypeScript** with no `any`.
- Define types for:
  - API responses
  - Component props
  - Custom hooks
- Create one file per feature inside `/types` (e.g., `types/user.ts`).
- Share types between features via `/types/index.ts` when needed.

---

# Folder Structure Guidelines

## Root Folders

/types → Feature-specific types (e.g., user.ts, property.ts)
/data → Shared queries and mutations (queries.ts, mutations.ts)
/common → Global constants and server utilities
/public → Static assets

shell
Copy
Edit

## /src Contents

/src/lib → Generic utils (utils.ts)
/src/hooks → Custom hooks (e.g., useUsers.ts)
/src/components
/ui → Shadcn UI elements
/users → User-specific components
/properties → Property-specific components
/layout → App layout shell
/shared → Reusable shared components

shell
Copy
Edit

## /app (Next.js)

/app → App router routes, layouts, loading states
/app/globals.css
/app/favicon.ico

markdown
Copy
Edit

---

# Coding Practices

## Use Feature-Based Architecture

- Every feature must have:
  - Its own `types/` file
  - Hook(s) inside `/hooks`
  - Components inside `components/<feature>/`
  - Dummy data if API is not yet available

## Alias Imports Only

- All imports must use the `@/` alias.
- ❌ `import x from '../../hooks'`
- ✅ `import x from '@/hooks'`

## No Prop Drilling

- Use context or hooks when state must be shared deeply.
- Keep component APIs simple and encapsulated.

## Keep Code Clean and Typed

- Avoid implicit `any`.
- Use named exports.
- Use clear prop names and types.
- Don’t leave unused code or dead comments.

## Reusability Over Duplication

- Reuse components and logic when applicable.
- Move common logic to `/lib` or `/common`.

## Dummy Data First

- Until the backend is ready, mock all data **per feature**.
- Avoid mixing static and dynamic logic — keep mock logic isolated.

---

# Examples

### ✅ Folder Layout (for `users`)

/types/user.ts
/hooks/useUsers.ts
/components/users/UserTable.tsx
/components/users/UserForm.tsx
/data/users.ts (mock data)



### ✅ Type File Example

```ts
// types/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
}
✅ Hook Example

// hooks/useUsers.ts
import useSWR from 'swr';
import { User } from '@/types/user';

export function useUsers() {
  return useSWR<User[]>('/api/users', fetcher);
}
