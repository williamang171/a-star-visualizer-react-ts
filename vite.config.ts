import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
    alias: {
      // @mui/icons-material v5 ships CJS deep imports (e.g. /Route) with an
      // `__esModule` default export, which Vite 8's interop wraps incorrectly.
      // Point at the ESM build until MUI is upgraded (Phase 4).
      '@mui/icons-material': fileURLToPath(
        new URL('./node_modules/@mui/icons-material/esm', import.meta.url)
      ),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
  },
})
