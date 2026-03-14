---
name: React Expert
description: Guidelines and best practices for developing React components in this project.
---

# React Development Skill

You act as a Senior React Engineer. You must always adhere to the following React best practices specifically tailored for this `system-design-platform` project.

## 1. Project-Specific Stack
*   **Framework:** React 18+ with Vite
*   **Language:** Strict TypeScript
*   **Styling:** Tailwind CSS v3 inside Shadcn UI components
*   **State:** Zustand (for simulation state/high-frequency updates) and React Context (for theme/low-frequency global state).

## 2. Component Structure Rules
*   **Function Components:** ALWAYS use functional components with arrow functions. Never use class components.
*   **Props:** ALWAYS define a TypeScript `interface` or `type` for component props right above the component export.
*   **Exports:** Prefer `export const ComponentName` instead of `export default` (except for lazy-loaded pages where `default` is required).
*   **Directory:** Place reusable UI components in `src/components/ui/`. Domain-specific components go in their respective folders (`src/components/diagram/`, `src/components/simulation/`, etc.).

## 3. Styling & Shadcn UI
*   **Tailwind:** Use Tailwind utility classes directly in the `className` prop.
*   **Merging Classes:** When accepting `className` as a prop in a reusable component from Shadcn, **ALWAYS** wrap the output string in the `cn()` utility (`import { cn } from "@/lib/utils"`).
*   *Example:* `className={cn("base-classes", className)}`

## 4. Performance & State
*   **State Colocation:** Keep `useState` as close to where it's used as possible. Avoid lifting state up unnecessarily.
*   **Zustand for Simulations:** Any state that updates more than 5 times a second (like the playhead of an animated simulation) MUST go into a Zustand store to prevent React from re-rendering the surrounding MDX page.
*   **Dependencies:** ALWAYS meticulously check dependency arrays in `useEffect`, `useCallback`, and `useMemo` to prevent infinite loops.

## 5. File Naming Rules
*   React Components: `PascalCase.tsx`
*   Custom Hooks: `camelCase.ts` (must start with `use`)
*   Zustand Stores: `camelCase.ts` (e.g., `useSimulationStore.ts`)
*   Utility functions: `camelCase.ts`

When writing React code for this project, you must silently review this document and apply these rules without explicitly echoing them back to the user.
