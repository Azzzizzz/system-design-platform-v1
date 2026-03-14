import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5173,
    strictPort: true,
  },
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [
          remarkGfm, 
          remarkFrontmatter, 
          [remarkMdxFrontmatter, { name: 'frontmatter' }],
          remarkMath
        ],
        rehypePlugins: [rehypeKatex],
        providerImportSource: "@mdx-js/react"
      })
    },
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // @ts-ignore
  test: {
    globals: true,
    environment: 'jsdom',
    exclude: ['**/node_modules/**', '**/dist/**', '**/tests/**'],
  },
})
