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
- Always use kebab-case naming convention for files and folders.

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

## /src Contents

/src/lib → Generic utils (utils.ts)
/src/hooks → Custom hooks (e.g., useUsers.ts)
/src/components
/ui → Shadcn UI elements
/users → User-specific components
/properties → Property-specific components
/layout → App layout shell
/shared → Reusable shared components

## /app (Next.js)

/app → App router routes, layouts, loading states
/app/globals.css
/app/favicon.ico

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
```

# Copywriting Guidelines for Admin Dashboard

These rules apply to all UI text in the real estate admin dashboard — including modals, buttons, labels, toasts, empty states, and errors. Write like a product, not like marketing. Prioritize clarity, precision, and user action.

---

## Keep It Clear and Concise

- Use simple, direct language.
- Cut filler. Focus on what the admin needs to see or do.
- ✅ Good: **"Add Property"**
- ❌ Bad: _"You can add a new property from here"_

---

## No Fluff or Marketing Speak

- This is a tool, not a landing page.
- Avoid vague terms like _“powerful”_, _“seamless”_, _“leverage”_.
- ✅ Good: **"Deactivate this user"**
- ❌ Bad: _"Unlock control over user access"_

---

## Use Action-Oriented Language

- Every action label should describe the result clearly.
- Use verbs: **View**, **Edit**, **Activate**, **Delete**, **Save**, **Filter**.
- ✅ Good: **"Edit Property"**, **"View User Profile"**
- ❌ Bad: _"Make Changes"_, _"See More"_

---

## Be Consistent in Formatting & Terminology

- Use the same terms across the dashboard.
- ✅ Good: **"Property Status"** everywhere
- ❌ Bad: _"Listing State"_, _"Active Flag"_
- Use numerals: **"3 listings"**, not _"three listings"_.

---

## Be Precise with Technical or Functional Copy

- If an action deletes data, say exactly what happens.
- ✅ Good: **"Deleting this property is permanent."**
- ❌ Bad: _"This might affect some things."_

---

## Remove Redundant Info

- Don’t restate the obvious.
- ✅ Good: **"No users found"**
- ❌ Bad: _"You are viewing an empty list of users."_

---

## Make Buttons and Actions Specific

- Buttons must reflect intent and outcome.
- ✅ Good: **"Update Price"**, **"Deactivate Listing"**, **"Save Changes"**
- ❌ Bad: _"Confirm"_, _"Okay"_, _"Done"_
- Use Title Case for buttons only.

---

## Use a Neutral, Professional Tone

- Keep copy calm and respectful. No emojis.
- ✅ Good: **"Something went wrong. Try again or contact support."**
- ❌ Bad: _"Oops! Something broke 😢"_

---

## Anticipate Admin Questions

- Be explicit about limitations.
- ✅ Good: **"Deactivation is only available for verified users."**
- ✅ Good: **"Editing properties is disabled for archived listings."**

---

## Keep Help Text Integrated

- Help should live near the element it describes.
- ✅ Good: Inline under field
- ❌ Bad: Long paragraph in sidebar

---

## Avoid Ambiguous Timeframes

- Don’t use "soon", "shortly", or "in a bit".
- ✅ Good: **"Changes saved instantly"**, **"Export ready in under 30 seconds"**

---

## Use Admin-Centered Language

- Talk about what the admin is doing, not what the system does.
- ✅ Good: **"You removed this listing."**
- ❌ Bad: _"The system has processed your removal."_

---

## Don’t Assume Knowledge — But Don’t Over-Explain

- Use familiar terms like **listing**, **status**, **user**.
- Add tooltips or links to docs for advanced features.

---

## Default to Positive, Constructive Language

- Help users fix the problem.
- ✅ Good: **"Couldn’t update property. Check your connection and try again."**
- ❌ Bad: _"Error: failed to process your request."_

---

## Eliminate Distractions During Critical Actions

- Keep confirmation prompts focused.
- ✅ Good: **"You're about to delete this user. This cannot be undone."**

---

## Error Messages Should Guide, Not Alarm

- State what went wrong and how to fix it.
- ✅ Good: **"Property ID is invalid. Please check the URL."**
- ❌ Bad: _"404 - Something went wrong"_

---

## Confirmation Messages Should Be Clear and Reassuring

- ✅ Good: **"Property updated successfully"**
- ✅ Good: **"Changes will appear in the listings page immediately."**

---

## Form Labels and Placeholders

- Keep labels short.
- Show valid examples in placeholders.
- Don’t repeat the label in the placeholder.
- ✅ Good:  
  Label: **Email**  
  Placeholder: **<admin@example.com>**

---

## CTA Buttons Must Be Precise

- Avoid vague actions like _Submit_ or _OK_.
- ✅ Good: **"Create Listing"**, **"Deactivate User"**

---

## Keep It Short, But Not Cryptic

- Minimum words, maximum clarity.
- ✅ Good: **"Saving…"**
- ❌ Bad: _"Your listing is currently undergoing the process of being submitted…"_

---

## Prioritize Clarity Over Cleverness

- Avoid jokes or metaphors.
- ✅ Good: **"Activate Property"**
- ❌ Bad: _"Wake the listing"_

---

## Only Say What’s Necessary

- ✅ Good: **"User created."**
- ❌ Bad: _"You’ve successfully created a user and will now be redirected…"_

---

## Use Sentence Case Everywhere (Except Buttons)

- Labels, descriptions, and errors = sentence case.
- ✅ Good: **"Property status must be selected."**

---

## Use Active Voice

- ✅ Good: **"You removed the listing."**
- ❌ Bad: _"The listing has been removed by the system."_

---

## Use Progressive Disclosure

- Reveal advanced options only when needed.
- ✅ Good: **"Show advanced filters"** toggle

---

## Use Specific, Repeatable Terms

- Always use the same word for the same thing.
- ✅ Good: **"Status"**
- ❌ Bad: _"State"_, _"Condition"_

---

## Assume Admins Are Competent

- Don’t explain common UI patterns.
- ✅ Good: **"Filter by Date"**
- ❌ Bad: _"This dropdown lets you sort dates by newest first."_

---

## If It Doesn’t Help, Cut It

- Every word should serve the user.
- ✅ Good: **"Listing created."**
- ❌ Bad: _"You’ve just completed the process of adding a new listing."_

# Code Review (if you are being asked to code review)

You are an expert code reviewer. Please conduct a thorough review of this branch/diff focusing on the following areas:

## Performance Analysis

- Identify potential performance bottlenecks or inefficiencies
- Look for unnecessary loops, redundant operations, or expensive function calls
- Check for proper use of data structures and algorithms
- Analyze memory usage patterns and potential leaks
- Review database queries for optimization opportunities

## Design Patterns & Architecture

- Check for proper separation of concerns and modularity
- Review naming conventions and code readability
- Identify opportunities for refactoring or pattern improvements

## Error Handling & Edge Cases

- Verify comprehensive error handling and graceful failure modes
- Check for proper input validation and sanitization
- Look for unhandled exceptions or error conditions
- Assess logging and debugging capabilities
- Review boundary conditions and edge case handling

## Bug Detection

- Identify potential runtime errors, null pointer exceptions, or type mismatches
- Look for race conditions, deadlocks, or concurrency issues
- Check for off-by-one errors, infinite loops, or logic flaws
- Verify proper resource management (file handles, connections, etc.)
- Review state management and data consistency

## UI/UX & Accessibility (if applicable)

- Verify semantic HTML structure and proper use of ARIA attributes
- Ensure keyboard navigation works properly (tab order, focus indicators)
- Validate screen reader compatibility and alt text for images
- Review responsive design and mobile accessibility
- Check for proper form labels and error messaging
- Assess loading states, animations, and motion sensitivity considerations
- Verify text scaling works up to 200% without loss of functionality
- Review heading hierarchy and document structure

## Security & Best Practices

- Check for security vulnerabilities (injection attacks, XSS, etc.)
- Verify proper authentication and authorization
- Review sensitive data handling and encryption
- Assess compliance with coding standards and best practices

## Copywriting

- If the change involves text that is user facing, the text should follow the copywriting guidelines mentioned above.

## Questions & Clarifications

When you encounter changes that are unclear or potentially problematic:

- Ask specific questions about the intent behind the change
- Request clarification on business logic or requirements
- Suggest alternative approaches when appropriate
- Ask about testing strategies for complex changes

## Review Format

For each issue found, please provide:

1. **Location**: File name and line numbers
2. **Severity**: Critical/High/Medium/Low
3. **Category**: Performance/Design/Bug/Security/Style
4. **Description**: Clear explanation of the issue
5. **Recommendation**: Specific suggestions for improvement
6. **Questions**: Any clarifying questions about the change

Please be thorough but constructive in your feedback, focusing on actionable improvements that enhance code quality, maintainability, and performance.
