// Правила слоёв FSD для Oxlint (перенос из biome.jsonc rbt-web, ADR 0003, 0012, 0013).
// Импорт разрешён только вниз: routes → app → pages → widgets → features → entities → shared.
// Options правила в override заменяют базовые, а не дополняют, поэтому шаблоны слайсов повторяются в каждом.

type Pattern = { group: string[]; message: string }

const SEGMENTS = '{ui,model,api,lib,config}'

// Снаружи слайса импортируем только его index.ts. Слайс может лежать в группе (`features/cart/add-to-cart`),
// поэтому глубину пути шаблон не считает: запрещён любой путь через сегмент слайса на любой глубине.
function slicePattern(layer: string): Pattern {
  return {
    group: [`@/${layer}/**/${SEGMENTS}`, `@/${layer}/**/${SEGMENTS}/**`],
    message: `Импорт в обход публичного API слайса: импортируйте из \`@/${layer}/<слайс>\` или \`@/${layer}/<группа>/<слайс>\` (index.ts), ADR 0012, 0013`,
  }
}

const sharedSegmentPattern: Pattern = {
  group: ['@/shared/api/**', '@/shared/config/**', '@/shared/seo/**', '@/shared/ui/*/**'],
  message:
    'Импорт в обход публичного API сегмента shared: импортируйте из `@/shared/<сегмент>` (для ui/lib — из модуля `@/shared/ui/Button`), ADR 0012',
}

/** Базовый набор: действует везде (routes, корневые файлы src, тесты). */
export const fsdSlicePatterns: Pattern[] = [
  ...['entities', 'features', 'widgets', 'pages'].map(slicePattern),
  sharedSegmentPattern,
]

function layerBan(from: string, target: string, message?: string): Pattern {
  return {
    group: [`@/${target}`, `@/${target}/**`],
    message: message ?? `Слой ${from} не может импортировать из ${target} (ADR 0003: импорт только вниз)`,
  }
}

type RestrictedImports = ['error', { patterns: Pattern[] }]

/** Набор правил no-restricted-imports для Oxlint: ["error", { patterns }]. */
export function restrictedImports(patterns: Pattern[]): RestrictedImports {
  return ['error', { patterns }]
}

function override(layer: string, bans: Pattern[]) {
  return {
    files: [`src/${layer}/**`],
    rules: { 'no-restricted-imports': restrictedImports([...bans, ...fsdSlicePatterns]) },
  }
}

export const fsdLintOverrides = [
  override(
    'shared',
    ['app', 'pages', 'widgets', 'features', 'entities', 'routes'].map((t) => layerBan('shared', t)),
  ),
  override(
    'entities',
    ['app', 'pages', 'widgets', 'features', 'routes'].map((t) => layerBan('entities', t)),
  ),
  override('features', [
    ...['app', 'pages', 'widgets', 'routes'].map((t) => layerBan('features', t)),
    layerBan(
      'features',
      'features',
      'Feature не импортирует другую feature: общее выносится в entity или shared (ADR 0003)',
    ),
  ]),
  override('widgets', [
    ...['app', 'pages', 'routes'].map((t) => layerBan('widgets', t)),
    layerBan(
      'widgets',
      'widgets',
      'Widget не импортирует другой widget: композиция виджетов — задача pages или app (ADR 0003)',
    ),
  ]),
  override('pages', [
    ...['app', 'routes'].map((t) => layerBan('pages', t)),
    layerBan('pages', 'pages', 'Page не импортирует другую page: общее выносится в widget или feature (ADR 0012)'),
  ]),
  override('app', [layerBan('app', 'routes')]),
]
