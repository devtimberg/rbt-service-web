import { defineConfig } from 'vite-plus'

// Генерируемые файлы не линтим и не форматируем
const ignorePatterns = ['.css-types/**', '**/generated/**', 'docs/**', '**/*.svg', '.next/**', 'next-env.d.ts']

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
    group: ['@/shared/api/**', '!@/shared/api/testing', '@/shared/config/**', '@/shared/seo/**'],
    message:
      'Импорт в обход публичного API сегмента shared: импортируйте из `@/shared/<сегмент>` (для ui — из барели `@/shared/ui`), ADR 0012',
  },
]

// UI-кит (барель, ADR 0012): вне shared/ui только `@/shared/ui`, внутри только относительные пути (иначе циклы)
const uiOutside = {
  group: ['@/shared/ui/**'],
  message: 'Импортируйте UI-кит одной строкой из `@/shared/ui` (барель), ADR 0012',
}
const uiInside = {
  group: ['@/shared/ui'],
  message: 'Внутри shared/ui барель не импортируем (циклы): относительный путь `../button`, ADR 0012',
}

// Правила слоёв из ADR 0003: app → pages → widgets → features → entities → shared.
// Импорт разрешён только вниз; для каждого слоя перечислены запрещённые.
const layers = ['app', 'pages', 'widgets', 'features', 'entities', 'shared'] as const
const sameLayerMessages: Partial<Record<(typeof layers)[number], string>> = {
  features: 'Feature не импортирует другую feature: общее выносится в entity или shared (ADR 0003)',
  pages: 'Page не импортирует другую page: общее выносится в widget или feature (ADR 0012)',
  widgets: 'Widget не импортирует другой widget: композиция виджетов — задача pages или app (ADR 0003)',
}

type RestrictedPattern = { group: string[]; message: string }

const restrictedImports = (patterns: RestrictedPattern[]): ['error', { patterns: RestrictedPattern[] }] => [
  'error',
  { patterns: [...patterns, ...publicApiPatterns, uiOutside] },
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
  ...forbidElements(['a'], 'используйте `SmartLink` из `@/shared/ui`'),
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
  ...forbidElements(['svg'], 'используйте иконку из `@/shared/ui`; новую иконку добавьте в src/shared/ui/icons/raw'),
  ...forbidElements(['hr'], missingComponent('Divider')),
  ...forbidElements(['form'], missingComponent('Form')),
  ...forbidElements(['label', 'fieldset', 'legend', 'output'], missingComponent('Field')),
]

export default defineConfig({
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
    // SVGR-генерация (pnpm run icons:build): `import * as React` в ней неиспользуемый, поэтому линтим без неё
    ignorePatterns: [...ignorePatterns, 'src/shared/ui/icons/**'],
    plugins: ['typescript', 'react', 'jsx-a11y', 'vitest', 'unicorn', 'nextjs'],
    categories: { correctness: 'error' },
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    rules: {
      'vite-plus/prefer-vite-plus-imports': 'error',
      'no-restricted-imports': restrictedImports([]),
      'unicorn/filename-case': ['error', { case: 'kebabCase' }],
      'vitest/require-mock-type-parameters': 'off',
      // Картинки рисует Image из shared/ui, next/image с оптимизацией в Node не используем
      'nextjs/no-img-element': 'off',
      // Внутренние ссылки решает SmartLink (next/link); голый <a> вне shared/ui и так запрещён react/forbid-elements
      'nextjs/no-html-link-for-pages': 'off',
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
      // Внутри кита барель запрещён; внешние слои `@/shared/ui/**` не импортируют (uiOutside выше)
      {
        files: ['src/shared/ui/**'],
        rules: { 'no-restricted-imports': ['error', { patterns: [...publicApiPatterns, uiInside] }] },
      },
      // Корневая app/ (маршруты Next) импортирует только из src через `@/`; имена папок и файлов задаёт Next
      {
        files: ['app/**'],
        rules: {
          'unicorn/filename-case': 'off',
          'no-restricted-imports': restrictedImports([
            { group: ['./**', '../**'], message: 'Корневая app/ импортирует только из src через `@/` (ADR 0009)' },
          ]),
        },
      },
    ],
    options: { typeAware: true, typeCheck: true },
  },
  // pre-commit (.vite-hooks/pre-commit → vp staged). Steiger проверяет src целиком, поэтому без списка файлов
  staged: {
    '*': 'vp check --fix',
    'src/**': () => 'steiger ./src',
  },
  // Алиас `@/` берётся из tsconfig.json (paths)
  resolve: { tsconfigPaths: true },
})
