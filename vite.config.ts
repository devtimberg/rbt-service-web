import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig, loadEnv } from 'vite-plus'
import { fsdLintOverrides, fsdSlicePatterns, restrictedImports } from './lint/fsd-rules'

export default defineConfig(({ mode }) => {
  // Vite отдаёт в process.env только VITE_*-переменные из .env. Серверные
  // (API_INTERNAL_URL, SESSION_SECRET) нужны SSR-коду через process.env, поэтому подмешиваем их сами.
  // Уже заданные в окружении значения не перезаписываем.
  const env = loadEnv(mode, process.cwd(), '')
  for (const [key, value] of Object.entries(env)) {
    process.env[key] ??= value
  }

  // В тестах (vp test) Start/Nitro/Tailwind не нужны: только React-плагин для JSX
  const isTest = mode === 'test'

  return {
    server: { port: 3000 },
    // Алиас `@/` → `src/` берётся из tsconfig.json (paths)
    resolve: { tsconfigPaths: true },
    plugins: isTest
      ? [viteReact()]
      : [
          tailwindcss(),
          tanstackStart(),
          // Nitro собирает Node-сервер в .output (см. Dockerfile)
          nitro(),
          // Плагин React обязан идти после tanstackStart
          viteReact(),
        ],

    test: {
      environment: 'jsdom',
      globals: false,
      setupFiles: ['./vitest.setup.ts'],
      include: ['src/**/*.test.{ts,tsx}'],
      env: {
        API_INTERNAL_URL: 'http://api.test',
        SESSION_SECRET: 'test-secret-test-secret-test-secret-0000',
      },
    },

    lint: {
      ignorePatterns: [
        '.output/**',
        '.tanstack/**',
        '**/routeTree.gen.ts',
        '**/generated/**',
        // SVGR-генерация (bun run icons:build): `import * as React` в ней неиспользуемый
        'src/shared/ui/icons/**',
      ],
      options: { typeAware: true, typeCheck: true },
      plugins: ['typescript', 'react', 'import', 'jsx-a11y', 'unicorn', 'oxc'],
      categories: { correctness: 'error' },
      rules: {
        // Обёртки Checkbox/RadioGroupItem содержат нативный input, как и сам Input
        'jsx-a11y/label-has-associated-control': [
          'error',
          { controlComponents: ['Checkbox', 'RadioGroupItem', 'Input'] },
        ],
        // Публичный API слайсов (ADR 0012, 0013): базовый набор действует везде, плюс overrides по слоям ниже
        'no-restricted-imports': restrictedImports(fsdSlicePatterns),
      },
      overrides: fsdLintOverrides,
    },

    // Стиль как в rbt-web (бывший Biome): 2 пробела, 120 колонок, одинарные кавычки, без «;»
    fmt: {
      semi: false,
      singleQuote: true,
      jsxSingleQuote: false,
      printWidth: 120,
      tabWidth: 2,
      useTabs: false,
      trailingComma: 'all',
      arrowParens: 'always',
      sortImports: { newlinesBetween: false },
      ignorePatterns: ['.output/**', '.tanstack/**', 'bun.lock', '**/routeTree.gen.ts', '**/generated/**'],
    },

    // pre-commit (lefthook) вызывает `vp staged`
    staged: {
      '*.{ts,tsx,js,mjs,css,json,md,yml}': 'vp check --fix',
    },
  }
})
