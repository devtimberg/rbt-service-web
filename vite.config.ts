import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig, lazyPlugins, loadEnv } from 'vite-plus'

// Генерируемые файлы не линтим и не форматируем
const ignorePatterns = [
  '**/routeTree.gen.ts',
  '.css-types/**',
  '**/generated/**',
  'docs/**',
  '**/*.svg',
  '.output/**',
  '.tanstack/**',
]

// Публичный API слайсов (ADR 0012, 0013): снаружи слайса импортируем только его index.ts.
// Слайс может лежать в группе (`features/cart/add-to-cart`), поэтому глубину пути шаблон не считает:
// запрещён любой путь, проходящий через сегмент слайса (`ui`, `model`, `api`, `lib`, `config`) на любой глубине.
const sliceSegments = '{ui,model,api,lib,config}'
const publicApiPatterns = [
  ...['entities', 'features', 'widgets', 'pages'].map((layer) => ({
    group: [`@/${layer}/**/${sliceSegments}`, `@/${layer}/**/${sliceSegments}/**`],
    message: `Импорт в обход публичного API слайса: импортируйте из \`@/${layer}/<слайс>\` или \`@/${layer}/<группа>/<слайс>\` (index.ts), ADR 0012, 0013`,
  })),
  {
    group: ['@/shared/api/**', '@/shared/config/**', '@/shared/seo/**', '@/shared/ui/*/**'],
    message:
      'Импорт в обход публичного API сегмента shared: импортируйте из `@/shared/<сегмент>` (для ui/lib — из модуля `@/shared/ui/Button`), ADR 0012',
  },
]

// Правила слоёв из ADR 0003: routes → app → pages → widgets → features → entities → shared.
// Импорт разрешён только вниз; для каждого слоя перечислены запрещённые.
const layers = ['routes', 'app', 'pages', 'widgets', 'features', 'entities', 'shared'] as const
const sameLayerMessages: Partial<Record<(typeof layers)[number], string>> = {
  features: 'Feature не импортирует другую feature: общее выносится в entity или shared (ADR 0003)',
  pages: 'Page не импортирует другую page: общее выносится в widget или feature (ADR 0012)',
  widgets: 'Widget не импортирует другой widget: композиция виджетов — задача pages или app (ADR 0003)',
}

type RestrictedPattern = { group: string[]; message: string }

const restrictedImports = (patterns: RestrictedPattern[]): ['error', { patterns: RestrictedPattern[] }] => [
  'error',
  { patterns: [...patterns, ...publicApiPatterns] },
]

// Опции правила в override заменяют базовые, поэтому publicApiPatterns повторяются в каждом слое
const layerOverrides = layers.slice(1).map((layer, index) => {
  const upper = layers.slice(0, index + 1).map((upperLayer) => ({
    group: [`@/${upperLayer}`, `@/${upperLayer}/**`],
    message: `Слой ${layer} не может импортировать из ${upperLayer} (ADR 0003: импорт только вниз)`,
  }))
  const sameLayer = sameLayerMessages[layer]
  const patterns = sameLayer ? [...upper, { group: [`@/${layer}`, `@/${layer}/**`], message: sameLayer }] : upper
  return { files: [`src/${layer}/**`], rules: { 'no-restricted-imports': restrictedImports(patterns) } }
})

// Голые HTML-элементы вне src/shared/ui запрещены: разметку собирают из примитивов (ADR о вёрстке в AGENTS.md)
const missingComponent = (component: string) =>
  `используйте \`${component}\` из \`@/shared/ui\`; если его ещё нет — создайте в src/shared/ui, а не верстайте на месте`

const forbidElements = (elements: string[], message: string) => elements.map((element) => ({ element, message }))

const forbiddenElements = [
  ...forbidElements(['a'], 'используйте `SmartLink` из `@/shared/ui` (или `Link` из роутера)'),
  ...forbidElements(
    ['button'],
    'используйте кнопку из `@/shared/ui`: `Button` (обычное действие, `variant`/`size`), `IconButton` (иконка), `Chip` (тег-фильтр); кнопка-триггер подсказки — `Tooltip`/`Popover`',
  ),
  ...forbidElements(
    ['input'],
    'используйте поле из `@/shared/ui`: `TextField` (текст с подписью), `TextInput` (стилизованное поле), `Input` (голое поле внутри своей рамки), `Checkbox`, `RadioGroup`/`RadioGroupItem`',
  ),
  ...forbidElements(['textarea'], missingComponent('TextArea')),
  ...forbidElements(['dialog'], 'используйте `Dialog` или `Sheet` из `@/shared/ui` (модалка/bottom-sheet)'),
  ...forbidElements(['select', 'option'], missingComponent('Select')),
  ...forbidElements(
    ['div', 'section', 'article', 'aside', 'header', 'footer', 'main', 'nav'],
    'используйте layout-компонент из `@/shared/ui` (`Container`, `Box`/`Stack` с `as` для семантики); если подходящего нет — создайте его в src/shared/ui, а не верстайте на месте',
  ),
  ...forbidElements(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'], missingComponent('Heading')),
  ...forbidElements(['p', 'span', 'b', 'strong', 's', 'br'], missingComponent('Text')),
  ...forbidElements(['ul', 'ol', 'li'], missingComponent('List')),
  ...forbidElements(['dl', 'dt', 'dd'], missingComponent('DescriptionList')),
  ...forbidElements(['img', 'picture', 'source'], missingComponent('Image')),
  ...forbidElements(['svg'], 'используйте иконку из `@/shared/ui/icons`; новую иконку добавьте туда же'),
  ...forbidElements(['hr'], missingComponent('Divider')),
  ...forbidElements(['form'], missingComponent('Form')),
  ...forbidElements(['label', 'fieldset', 'legend', 'output'], missingComponent('Field')),
]

export default defineConfig(({ mode }) => {
  // Vite отдаёт в process.env только VITE_*-переменные из .env. Серверные
  // (API_INTERNAL_URL) нужны SSR-коду через process.env, поэтому подмешиваем их сами.
  // Уже заданные в окружении значения не перезаписываем.
  const env = loadEnv(mode, process.cwd(), '')
  for (const [key, value] of Object.entries(env)) {
    process.env[key] ??= value
  }

  return {
    fmt: {
      // Markdown и YAML не форматируем — оставляем как есть
      ignorePatterns: [...ignorePatterns, '**/*.md', '**/*.yaml', '**/*.yml'],
      printWidth: 120,
      singleQuote: true,
      semi: false,
      sortImports: { newlinesBetween: false },
      sortPackageJson: false,
      overrides: [{ files: ['**/*.css'], options: { singleQuote: false } }],
    },
    lint: {
      // SVGR-генерация (bun run icons:build): `import * as React` в ней неиспользуемый, поэтому линтим без неё
      ignorePatterns: [...ignorePatterns, 'src/shared/ui/icons/**'],
      plugins: ['typescript', 'react', 'jsx-a11y', 'vitest'],
      categories: { correctness: 'error' },
      jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
      rules: {
        'vite-plus/prefer-vite-plus-imports': 'error',
        'no-restricted-imports': restrictedImports([]),
        'vitest/require-mock-type-parameters': 'off',
        'react/forbid-elements': ['error', { forbid: forbiddenElements }],
        // Обёртки Checkbox/RadioGroupItem содержат нативный input, как и сам Input
        'jsx-a11y/label-has-associated-control': [
          'error',
          { controlComponents: ['Checkbox', 'RadioGroupItem', 'Input', 'TextInput'] },
        ],
      },
      overrides: [
        ...layerOverrides,
        // Разметку на HTML-элементах пишет только shared/ui; тесты рендерят заглушки слотов
        { files: ['src/shared/ui/**', '**/*.test.tsx'], rules: { 'react/forbid-elements': 'off' } },
      ],
      options: { typeAware: true, typeCheck: true },
    },
    // pre-commit (.vite-hooks/pre-commit → vp staged). Steiger проверяет src целиком, поэтому без списка файлов
    staged: {
      '*': 'vp check --fix',
      'src/**': () => 'bun --bun steiger ./src',
    },
    server: { port: 3000 },
    // Алиас `@/` → `src/` берётся из tsconfig.json (paths)
    resolve: { tsconfigPaths: true },
    plugins:
      lazyPlugins(() => [
        tanstackStart(),
        // Nitro собирает Node-сервер в .output (см. Dockerfile)
        nitro({
          routeRules: {
            '/**': {
              headers: {
                'X-Frame-Options': 'DENY',
                'X-Content-Type-Options': 'nosniff',
                'Referrer-Policy': 'strict-origin-when-cross-origin',
              },
            },
          },
        }),
        // Плагин React обязан идти после tanstackStart
        viteReact(),
      ]) ?? [],
  }
})
