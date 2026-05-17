# AGENTS.md (scope: `frontend/`)

## Architecture goal
Keep the frontend architecture separated by responsibility, and **do not put all logic into `page.tsx`**.

## Mandatory rules for App Router (`src/app/**`)
1. `page.tsx` should stay as route-level composition/render only:
   - read `params` / `searchParams`,
   - wire up extracted hooks/components,
   - avoid direct API calls and heavy business logic.
2. Split each module/feature into the following parts when applicable:
   - `hooks/`: state management, side effects, data-fetch orchestration.
   - `components/`: UI components (presentational or thin container components).
   - `services/`: API clients, request/response mapping, domain actions.
   - `types.ts` or `types.tsx`: shared feature-level type definitions.
3. Do not place complex fetching functions, large data transforms, or long business/form workflows directly in `page.tsx`.
4. Prefer feature-level colocation near the related route (for example inside the route folder or `(features)`), instead of creating a single “god file”.

## Implementation conventions
- Reuse `src/shared/**` for logic shared across multiple features.
- Keep dependency direction clear: `page` -> `hooks/services/components/types`; avoid circular dependencies.
- Suggested naming conventions:
  - `hooks/use-<feature>.ts`
  - `services/<feature>.service.ts`
  - `components/<Feature>*.tsx`
  - `types.ts`

## Refactoring legacy routes
- Incrementally extract logic from `page.tsx` into `hooks/`, `services/`, `components/`, and `types.ts(x)`.
- Keep each PR small and behavior-preserving.
