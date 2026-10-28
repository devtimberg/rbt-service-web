// Чистая логика сравнения снимков стилей: разбор путей, проверка здоровья снимка, разбор отличий.
// Без Playwright и файловой системы, покрыта офлайн-тестом (analyze.test.ts). Снимает страницы snapshot.ts.

/** Один элемент: геометрия, вычисленные стили (имя свойства → значение), классы для отчёта. */
export type ElementEntry = { rect: number[]; cls: string | null } & Record<string, unknown>

/** Страница на одной ширине: ответ сервера, итоговый адрес, проверки CSS и элементы по пути в DOM. */
export type PageSnapshot = {
  status: number | null
  finalPath: string
  /** Элементы с классом CSS-модуля, которого нет ни в одной загруженной таблице стилей. */
  unstyledModuleClasses: string[]
  /** Таблицы стилей `<link rel="stylesheet">`, которые не загрузились. */
  failedStylesheets: string[]
  elements: Record<string, ElementEntry>
}

export type Snapshot = {
  meta: { baseUrl: string; createdAt: string; widths: number[]; targets: PathTarget[] }
  /** Ключ: `<ширина> <путь>`. */
  pages: Record<string, PageSnapshot>
}

/** Путь страницы и ожидаемый статус: `/cart` (200), `/some-unknown-page@404`, `/profile@307`. */
export type PathTarget = { path: string; status: number }

/**
 * Разбирает пути из аргументов. Ловит главную ловушку: в zsh `$P` со списком через пробел не разбивается, и вместо
 * семи страниц снимается одна с адресом из пробелов (сервер отвечает 404, оба снимка сравнивают страницу ошибки).
 */
export function parseTargets(args: string[]): PathTarget[] {
  if (args.length === 0) throw new Error('Не переданы пути страниц')
  const targets = args.map((arg) => {
    if (/\s/.test(arg)) {
      throw new Error(
        `Путь с пробелом: «${arg}». Похоже, список путей передан одной строкой (в zsh: P=(/ /cart) и "\${P[@]}")`,
      )
    }
    const match = /^(\/[^@]*)(?:@(\d{3}))?$/.exec(arg)
    if (!match?.[1]) throw new Error(`Путь должен начинаться с «/»: «${arg}» (ожидаемый статус: «/path@404»)`)
    return { path: match[1], status: match[2] ? Number(match[2]) : 200 }
  })
  const seen = new Set<string>()
  for (const { path } of targets) {
    if (seen.has(path)) throw new Error(`Путь повторяется: ${path}`)
    seen.add(path)
  }
  return targets
}

/** Путь из адреса как в аргументах: pathname + search (`/cat/x/?page=2`). */
export function pathOf(url: string): string {
  const parsed = new URL(url)
  return parsed.pathname + parsed.search
}

/** Проблемы снимка, из-за которых сравнение было бы ложным. Пустой список: снимок годен. */
export function healthProblems(snapshot: Snapshot): string[] {
  const problems: string[] = []
  const expected = new Map(snapshot.meta.targets.map((target) => [target.path, target.status]))
  for (const [key, page] of Object.entries(snapshot.pages)) {
    const path = key.slice(key.indexOf(' ') + 1)
    const status = expected.get(path)
    if (page.status !== status) problems.push(`${key}: статус ${page.status ?? 'нет ответа'}, ожидался ${status}`)
    if (status !== undefined && status < 300 && page.finalPath !== path) {
      problems.push(`${key}: редирект на ${page.finalPath}`)
    }
    if (page.failedStylesheets.length > 0) {
      problems.push(`${key}: не загрузились стили ${page.failedStylesheets.join(', ')}`)
    }
    if (page.unstyledModuleClasses.length > 0) {
      problems.push(
        `${key}: классы CSS-модулей без правил в загруженных стилях (${page.unstyledModuleClasses.slice(0, 5).join(', ')}` +
          `${page.unstyledModuleClasses.length > 5 ? ', …' : ''}). Часто это прод-сервер, запущенный до пересборки .output`,
      )
    }
    if (Object.keys(page.elements).length === 0) problems.push(`${key}: в снимке нет элементов`)
  }
  for (const width of snapshot.meta.widths) {
    for (const { path } of snapshot.meta.targets) {
      if (!snapshot.pages[`${width} ${path}`]) problems.push(`${width} ${path}: страницы нет в снимке`)
    }
  }
  return problems
}

export type Difference = { page: string; element: string; property: string; before: unknown; after: unknown }

export type Comparison = {
  /** Страница×ширина → число элементов в эталоне и в проверяемой сборке. */
  coverage: Record<string, { before: number; after: number }>
  differences: Difference[]
  /**
   * Отличия `margin-*` у элемента с той же геометрией: на раскладку не влияют. Так браузер отдаёт `margin: auto`
   * (центрирование Container), когда полоса прокрутки и ширина контента меняются во время замера.
   */
  neutral: Difference[]
  /** Элементы, которые есть только в одном снимке (сдвиг структуры DOM). */
  structural: { page: string; element: string; side: 'before' | 'after' }[]
}

/**
 * Сравнивает все элементы всех страниц полностью (без усечения), по каждому вычисленному свойству и геометрии.
 * `ignore`: регулярные выражения по строке `<ширина> <путь> <элемент>` для известного шума (автопрокрутка карусели).
 * `ignoreProperties`: регулярные выражения по имени свойства для ожидаемых отличий во всех элементах (`font-family`
 * при смене способа подключения шрифта: геометрия при этом сравнивается и ловит другой шрифт).
 */
export function compareSnapshots(
  before: Snapshot,
  after: Snapshot,
  ignore: RegExp[] = [],
  ignoreProperties: RegExp[] = [],
): Comparison {
  const coverage: Comparison['coverage'] = {}
  const differences: Difference[] = []
  const neutral: Difference[] = []
  const structural: Comparison['structural'] = []
  const skip = (page: string, element: string) => ignore.some((pattern) => pattern.test(`${page} ${element}`))

  for (const page of new Set([...Object.keys(before.pages), ...Object.keys(after.pages)])) {
    const a = before.pages[page]?.elements ?? {}
    const b = after.pages[page]?.elements ?? {}
    coverage[page] = { before: Object.keys(a).length, after: Object.keys(b).length }
    for (const element of new Set([...Object.keys(a), ...Object.keys(b)])) {
      if (skip(page, element)) continue
      const ea = a[element]
      const eb = b[element]
      if (!ea || !eb) {
        structural.push({ page, element, side: ea ? 'before' : 'after' })
        continue
      }
      const sameRect = JSON.stringify(ea.rect) === JSON.stringify(eb.rect)
      for (const property of new Set([...Object.keys(ea), ...Object.keys(eb)])) {
        if (property === 'cls' || ignoreProperties.some((pattern) => pattern.test(property))) continue
        if (JSON.stringify(ea[property]) !== JSON.stringify(eb[property])) {
          const difference = { page, element, property, before: ea[property], after: eb[property] }
          ;(sameRect && property.startsWith('margin-') ? neutral : differences).push(difference)
        }
      }
    }
  }
  return { coverage, differences, neutral, structural }
}

/** Текстовый отчёт: охват, итог, отличия по свойствам и по страницам, примеры. */
export function formatReport(comparison: Comparison, examplesPerProperty = 5): string {
  const lines: string[] = []
  const pages = Object.entries(comparison.coverage)
  const total = pages.reduce((sum, [, { after }]) => sum + after, 0)
  lines.push(`Охват: ${pages.length} страниц×ширин, ${total} элементов в проверяемой сборке`)
  for (const [page, { before, after }] of pages) {
    lines.push(`  ${page}: ${before} → ${after}${before === after ? '' : '  (число элементов отличается)'}`)
  }

  const { differences, neutral, structural } = comparison
  if (neutral.length > 0) {
    lines.push('', `Без влияния на геометрию (margin при том же прямоугольнике элемента): ${neutral.length}`)
  }
  if (differences.length === 0 && structural.length === 0) {
    lines.push('', 'ОТЛИЧИЙ НЕТ')
    return lines.join('\n')
  }

  const byProperty = countBy(differences, (difference) => difference.property)
  const byPage = countBy([...differences, ...structural], (difference) => difference.page)
  lines.push(
    '',
    `ОТЛИЧИЯ: ${differences.length} значений свойств, ${structural.length} элементов только в одном снимке`,
  )
  lines.push('По свойствам:', ...byProperty.map(([property, count]) => `  ${count}  ${property}`))
  lines.push('По страницам:', ...byPage.map(([page, count]) => `  ${count}  ${page}`))
  lines.push('Примеры:')
  for (const [property] of byProperty) {
    for (const d of differences
      .filter((difference) => difference.property === property)
      .slice(0, examplesPerProperty)) {
      lines.push(`  ${property}  ${d.page}  ${d.element}\n    ${JSON.stringify(d.before)} → ${JSON.stringify(d.after)}`)
    }
  }
  for (const s of structural.slice(0, examplesPerProperty * 2)) {
    lines.push(`  только в ${s.side === 'before' ? 'эталоне' : 'проверяемой'}  ${s.page}  ${s.element}`)
  }
  return lines.join('\n')
}

function countBy<T>(items: T[], key: (item: T) => string): [string, number][] {
  const counts = new Map<string, number>()
  for (const item of items) counts.set(key(item), (counts.get(key(item)) ?? 0) + 1)
  return [...counts].sort((x, y) => y[1] - x[1])
}
