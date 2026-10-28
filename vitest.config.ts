import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite-plus'

// Отдельный конфиг: тестам не нужны плагины Start/Nitro/Tailwind
export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [viteReact()],
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.ts'],
    env: {
      API_INTERNAL_URL: 'http://api.test',
      SESSION_SECRET: 'test-secret-test-secret-test-secret-0000',
    },
  },
})
