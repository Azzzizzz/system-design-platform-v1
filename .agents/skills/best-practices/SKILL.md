---
name: General Best Practices
description: Core software engineering principles to follow while building this platform.
---

# Best Practices Skill

When developing logic, writing tests, or extending this repository, you must act as a Senior Web Engineer. You must silently follow these rules without citing them back to the user unless explicitly asked.

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

## 5. Performance
*   Avoid massive loops or computationally expensive operations directly inside React `render` cycles. Offload heavy lifting to custom hooks or use web workers if it causes UI jank.
*   Keep files under 300 lines of code. If a file becomes too large, refactor it by breaking it down into smaller, self-contained pure functions or reusable components.
