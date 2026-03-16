---
name: General Best Practices
description: Core software engineering principles to follow while building this platform.
---

# Best Practices Skill

When developing logic, writing tests, or extending this repository, you must act as a Senior Web Engineer. You must silently follow these rules without citing them back to the user unless explicitly asked.

## 🏆 The Golden Rules (CRITICAL)
Before any implementation, you MUST internalize these rules:
1.  **React Flow Mandatory**: Use React Flow for ALL diagrams, simulations, and visualizations.
2.  **Strict Testing Policy**:
    - **NO Automated Tests**: Never write unit/E2E tests unless asked.
    - **NO Browser Control**: Never use Antigravity browser tools unless asked.
3.  **Maximum Reusability**: Do not duplicate styles or logic. Reuse shared components/utilities everywhere.

## 1. Clean Code & Readability
*   **Self-Documenting Code:** Write code that explains itself through excellent variable/function names. Avoid "magic strings" and "magic numbers".
*   **Comments:** Use comments to explain *why* something is done, not *what* is done. Comment complex regex, confusing algorithms, or deliberate workarounds.
*   **Dead Code:** Always remove `console.log`, `debugger`, and unused imports before finishing a task. 

## 2. Naming Conventions
*   **Variables/Functions:** Use descriptive, unabbreviated `camelCase` (e.g., `fetchUserProfile`, not `fetchUsrPrfl`).
*   **Booleans:** Prefix booleans with `is`, `has`, or `should` (e.g., `isLoading`, `hasError`).
*   **Constants:** Use `UPPER_SNAKE_CASE` for global constant arrays or configuration values.

## 3. Reliability & Error Handling
*   **Fail Gracefully:** Never allow an unhandled error to crash the user interface. Use `try/catch` around asynchronous operations and fallback UI states.
*   **Descriptive Errors:** Ensure error messages (even in console logs) include the context of *where* and *why* it failed.
*   **Edge Cases:** Always consider the "empty state" (no data), "loading state" (data fetching), and "error state" (fetch failed).

## 4. Security
*   **No Hardcoded Secrets:** Never put an API key or Token into the frontend source code. Assume everything in `src/` is publicly visible.
*   **Data Validation:** Do not trust user input if/when data entry forms are added to the platform. 

## 5. REUSABILITY MANDATE
- **DRY (Don't Repeat Yourself)**: Always check `src/components/diagram/nodes/` and `src/components/diagram/edges/` for existing types before creating new ones.
- **Global Stylings**: All diagram-related styles must live in `src/styles/diagram.css` or `src/styles/react-flow-overrides.css`.

## 6. Diagram Rules
1. **React Flow ONLY**: Do not use ad-hoc SVGs or CSS for architecture visualizations.
2. **IDs inside `nodes` and `edges` must be extremely short** (e.g., `client1`, `lb1`, `api1`, `db1`).
3. **Spacing**: Lay out nodes with roughly `200px` to `300px` of space between them. For hierarchical diagrams, `y` coordinates should increase by `150px` per layer.

Please see the example in `examples/load-balancer-config.ts` in this skill to understand the strict formatting.

## 7. Performance
*   Avoid massive loops or computationally expensive operations directly inside React `render` cycles. Offload heavy lifting to custom hooks or use web workers if it causes UI jank.
*   Keep files under 300 lines of code. If a file becomes too large, refactor it by breaking it down into smaller, self-contained pure functions or reusable components.
