import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

/**
 * Mirrors the Figma Make project's config. The Figma-only plugins
 * (site.json shell, error-overlay replay, refresh fallback, kit route)
 * are omitted — they serve the Make editor and have no effect on render.
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
