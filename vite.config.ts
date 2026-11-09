import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
  },
  // Vitest runs dependencies through Node's SSR resolver, which does not use
  // the `module`/`browser` export conditions that Emotion relies on. Mirror
  // the browser conditions so `@emotion/styled` resolves to its ESM build.
  ssr: {
    resolve: {
      conditions: ['module', 'browser', 'development', 'import', 'default'],
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
  },
})
