/// <reference types="vite/client" />

declare module '*.mdx' {
  import type { ComponentType } from 'react';
  
  export const frontmatter: any;
  const component: ComponentType<any>;
  export default component;
}
