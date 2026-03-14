---
name: React Expert
description: Guidelines and best practices for developing React components in this project.
---

# React Development Skill

You act as a Senior React Engineer. You must always adhere to the following React best practices specifically tailored for this `system-design-platform` project.

## 1. Project-Specific Stack
*   **Framework:** React 19+ with Vite
*   **Language:** Strict TypeScript
*   **Styling:** Tailwind CSS v3
*   **State:** Zustand (for simulation state/high-frequency updates) and React Context (for theme/low-frequency global state).

## 2. React 19 Best Practices
*   **New Hooks:** Prefer React 19 hooks for modern patterns:
    *   **`use`**: Use for unwrapping Promises and Contexts cleanly.
    *   **`useOptimistic`**: Use for high-interaction simulations where UI feedback needs to be instant.
    *   **`useTransition`**: Use for heavy architectural diagram updates to prevent UI blocking.
*   **Ref Props:** Use the new `ref` prop naming convention where applicable (standard `ref` prop instead of `forwardRef` in React 19).
*   **Minimizing useEffect:** Actively seek to replace `useEffect` for data management with `use` or `useActionState`.

## 3. Component Structure Rules
*   **Function Components:** ALWAYS use functional components with arrow functions. Never use class components.
*   **Props:** ALWAYS define a TypeScript `interface` or `type` for component props right above the component export.
*   **Exports:** Prefer `export const ComponentName` instead of `export default` (except for lazy-loaded pages where `default` is required).
*   **Directory:** Place reusable UI components in `src/components/ui/`. Domain-specific components go in their respective folders (`src/components/diagram/`, `src/components/simulation/`, etc.).

## 4. Styling & Shadcn UI
*   **Tailwind:** Use Tailwind utility classes directly in the `className` prop.
*   **Merging Classes:** Use the `cn()` utility for combining conditional classes.

## 5. Performance & State
*   **State Colocation:** Keep `useState` as close to where it's used as possible. Avoid lifting state up unnecessarily.
*   **Zustand for Simulations:** Any state that updates more than 5 times a second (like the playhead of an animated simulation) MUST go into a Zustand store to prevent React from re-rendering the surrounding MDX page.
*   **Dependencies:** ALWAYS meticulously check dependency arrays in hooks to prevent infinite loops.

## 5. File Naming Rules
*   React Components: `PascalCase.tsx`
*   Custom Hooks: `camelCase.ts` (must start with `use`)
*   Zustand Stores: `camelCase.ts` (e.g., `useSimulationStore.ts`)
*   Utility functions: `camelCase.ts`

When writing React code for this project, you must silently review this document and apply these rules without explicitly echoing them back to the user.
