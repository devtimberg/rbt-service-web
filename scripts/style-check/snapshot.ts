// Снимок страниц в Playwright: геометрия и ~100 вычисленных свойств каждого элемента (с ::before/::after/::placeholder)
// на нескольких ширинах, плюс сведения для проверки здоровья снимка (analyze.ts → healthProblems).
import { type Browser, chromium, type Page } from '@playwright/test'
import { type ElementEntry, type PageSnapshot, pathOf, type PathTarget, type Snapshot } from './analyze.ts'

export const DEFAULT_WIDTHS = [375, 768, 1024, 1280, 1440]

const PROPERTIES = `display position top right bottom left float z-index box-sizing
margin-top margin-right margin-bottom margin-left padding-top padding-right padding-bottom padding-left
gap row-gap column-gap flex-direction flex-wrap flex-grow flex-shrink flex-basis align-items align-self justify-content
justify-self order grid-template-columns grid-template-rows grid-column grid-row min-width max-width min-height max-height
font-family font-size font-weight font-style line-height letter-spacing color text-align text-decoration-line
text-transform white-space text-overflow overflow-wrap word-break vertical-align
background-color background-image border-top-width border-right-width border-bottom-width border-left-width
border-top-color border-right-color border-bottom-color border-left-color
border-top-style border-right-style border-bottom-style border-left-style
border-top-left-radius border-top-right-radius border-bottom-left-radius border-bottom-right-radius
box-shadow opacity overflow-x overflow-y visibility cursor pointer-events user-select transform
transition-property transition-duration transition-timing-function animation-name animation-duration
outline-style outline-width outline-color outline-offset object-fit object-position aspect-ratio fill stroke
list-style-type content scrollbar-width`.split(/\s+/)

/**
 * Имя класса CSS-модуля: в сборке Vite `_<имя>_<хеш>_<строка>` (`_container_dec27_3`), в прод-сборке Next (Turbopack)
 * `<хеш 6>_<имя>` (`wzWnKa_root`). Шаблон по умолчанию узнаёт оба, поэтому эталон на Vite и ветку на Next
 * можно сравнивать без --module-class. Другой формат (dev Next: `<файл>-module__<хеш>__<имя>`): свой шаблон через --module-class.
 */
export const MODULE_CLASS = /^(_[A-Za-z][\w-]*_[a-z0-9]{5}_\d+|[\w-]{6}_[A-Za-z][A-Za-z0-9]*)$/

export type SnapshotOptions = {
  baseUrl: string
  targets: PathTarget[]
  widths?: number[]
  /** Прокрутить страницу до низа и обратно перед замером, чтобы ленивые картинки загрузились одинаково. */
  scroll?: boolean
  moduleClass?: RegExp
}

export async function takeSnapshot(options: SnapshotOptions, browser?: Browser): Promise<Snapshot> {
  const widths = options.widths ?? DEFAULT_WIDTHS
  const own = browser ? null : await chromium.launch()
  const active = browser ?? own!
  const pages: Record<string, PageSnapshot> = {}
  try {
    for (const width of widths) {
      const page = await active.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' })
      for (const target of options.targets) {
        pages[`${width} ${target.path}`] = await capturePage(page, options, target)
      }
      await page.close()
    }
  } finally {
    await own?.close()
  }
  return {
    meta: { baseUrl: options.baseUrl, createdAt: new Date().toISOString(), widths, targets: options.targets },
    pages,
  }
}

async function capturePage(page: Page, options: SnapshotOptions, target: PathTarget): Promise<PageSnapshot> {
  const response = await page.goto(new URL(target.path, options.baseUrl).href, {
    waitUntil: 'networkidle',
    timeout: 60_000,
  })
  // Статус первого ответа в цепочке редиректов: так `/cabinet/@307` проверяет сам редирект
  let request = response?.request() ?? null
  while (request?.redirectedFrom()) request = request.redirectedFrom()
  const status = request ? ((await request.response())?.status() ?? null) : null

  await page.evaluate(() => document.fonts.ready)
  if (options.scroll !== false) {
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y)
        await new Promise((resolve) => setTimeout(resolve, 30))
      }
      window.scrollTo(0, 0)
    })
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)
  }

  const captured = await page.evaluate(
    ({ properties, moduleClass }) => {
      // Классы, упомянутые в селекторах загруженных таблиц стилей (включая вложенные правила и @media)
      const known = new Set<string>()
      const collect = (rules: CSSRuleList) => {
        for (const rule of Array.from(rules)) {
          if ('selectorText' in rule && typeof rule.selectorText === 'string') {
            for (const match of rule.selectorText.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) known.add(match[1]!)
          }
          if ('cssRules' in rule && rule.cssRules) collect(rule.cssRules as CSSRuleList)
        }
      }
      const failedStylesheets: string[] = []
      for (const link of Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'))) {
        if (!link.sheet) failedStylesheets.push(link.getAttribute('href') ?? '(без href)')
      }
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          collect(sheet.cssRules)
        } catch {
          // Чужой домен без CORS: правила недоступны, классы оттуда не проверяем
        }
      }
      const pattern = new RegExp(moduleClass)
      const unstyled = new Set<string>()
      const elements: Record<string, Record<string, unknown>> = {}

      const walk = (el: Element, key: string) => {
        const style = getComputedStyle(el)
        const rect = el.getBoundingClientRect()
        const entry: Record<string, unknown> = {
          rect: [rect.x, rect.y + window.scrollY, rect.width, rect.height].map((n) => Math.round(n * 2) / 2),
          cls: el.getAttribute('class'),
        }
        for (const property of properties) entry[property] = style.getPropertyValue(property)
        for (const pseudo of ['::before', '::after', '::placeholder']) {
          const pseudoStyle = getComputedStyle(el, pseudo)
          if (pseudoStyle.content && pseudoStyle.content !== 'none' && pseudoStyle.content !== 'normal') {
            for (const property of properties) entry[pseudo + property] = pseudoStyle.getPropertyValue(property)
          }
        }
        for (const name of Array.from(el.classList)) if (pattern.test(name) && !known.has(name)) unstyled.add(name)
        elements[key] = entry
        const counts: Record<string, number> = {}
        for (const child of Array.from(el.children)) {
          const tag = child.tagName.toLowerCase()
          if (tag === 'script' || tag === 'style' || tag === 'link' || tag === 'template') continue
          // Служебные узлы Next без вида: объявление переходов для скринридеров и скрытая граница метаданных в начале
          // body. Иначе сдвинулись бы номера соседних div, и сравнение с эталоном без них развалилось бы целиком
          if (tag === 'next-route-announcer' || (el === document.body && child.hasAttribute('hidden'))) continue
          counts[tag] = (counts[tag] ?? 0) + 1
          walk(child, `${key}>${tag}:${counts[tag]}`)
        }
      }
      walk(document.body, 'body')
      return { elements, failedStylesheets, unstyledModuleClasses: [...unstyled].sort() }
    },
    { properties: PROPERTIES, moduleClass: (options.moduleClass ?? MODULE_CLASS).source },
  )

  return {
    status,
    finalPath: pathOf(page.url()),
    unstyledModuleClasses: captured.unstyledModuleClasses,
    failedStylesheets: captured.failedStylesheets,
    elements: captured.elements as Record<string, ElementEntry>,
  }
}
