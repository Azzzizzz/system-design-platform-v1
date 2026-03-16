# System Design Learning Platform

This platform is a high-fidelity, interactive system design learning tool built with React, TypeScript, and Vite.

## 🏆 Project Golden Rules

To maintain the quality and consistency of this platform, the following rules MUST be followed without exception:

1.  **Unified Visualization**: **React Flow** is the mandatory engine for ALL architecture diagrams and visualizations. Do not use generic CSS or SVG for diagrams.
2.  **Strict Testing Policy**:
    - **No Automated Tests**: Never write unit tests (Vitest) or E2E tests (Playwright) unless explicitly asked by the USER.
    - **No Browser Control**: Never use the Antigravity browser control or manual testing tools unless explicitly asked.
3.  **Maximum Reusability**: Actively reuse nodes (`ServiceNode`, etc.), edges, and global CSS utilities. Do not duplicate code across different topics.
4.  **Premium Aesthetics**: Maintain the Linear-inspired glassmorphism design across all components.

## 🎓 Content & UX Standards

1.  **Beginner-Friendly Tone**: Use simplified language and analogies. "Explain like I'm five" for the base concept.
2.  **Self-Explanatory Diagrams**: Architecture must be visually logical without needing a manual.
3.  **Strict Point Limits**: 4 to 6 points MAX for Tradeoffs, Q&A, and Summaries. No more, no less.
4.  **Simple Real-World Context**: Connect every complex system to a simple app the user knows.

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
