import { describe, expect, it } from 'vite-plus/test'
import {
  compareSnapshots,
  type ElementEntry,
  formatReport,
  healthProblems,
  type PageSnapshot,
  parseTargets,
  type Snapshot,
} from './analyze'

const element = (overrides: Record<string, unknown> = {}): ElementEntry => ({
  rect: [0, 0, 100, 20],
  cls: null,
  color: 'rgb(0, 0, 0)',
  ...overrides,
})

const page = (overrides: Partial<PageSnapshot> = {}): PageSnapshot => ({
  status: 200,
  finalPath: '/',
  unstyledModuleClasses: [],
  failedStylesheets: [],
  elements: { body: element(), 'body>div:1': element() },
  ...overrides,
})

function snapshot(pages: Record<string, PageSnapshot>, targets = [{ path: '/', status: 200 }]): Snapshot {
  return { meta: { baseUrl: 'http://localhost:3200', createdAt: '', widths: [375], targets }, pages }
}

describe('parseTargets', () => {
  it('список путей одной строкой (zsh без разбиения) отклоняется', () => {
    expect(() => parseTargets(['/ /cat/x/ /basket/'])).toThrow(/одной строкой/)
  })

  it('ожидаемый статус через @, по умолчанию 200', () => {
    expect(parseTargets(['/basket/', '/missing/@404', '/cat/x/?page=2'])).toEqual([
      { path: '/basket/', status: 200 },
      { path: '/missing/', status: 404 },
      { path: '/cat/x/?page=2', status: 200 },
    ])
  })

  it('путь без слэша, повтор и пустой список отклоняются', () => {
    expect(() => parseTargets(['basket/'])).toThrow(/начинаться с «\/»/)
    expect(() => parseTargets(['/a/', '/a/@404'])).toThrow(/повторяется/)
    expect(() => parseTargets([])).toThrow(/Не переданы/)
  })
})

describe('healthProblems', () => {
  it('годный снимок без проблем', () => {
    expect(healthProblems(snapshot({ '375 /': page() }))).toEqual([])
  })

  it('страница ошибки вместо ожидаемой страницы — проблема, даже если она одинакова в обеих сборках', () => {
    expect(healthProblems(snapshot({ '375 /': page({ status: 404 }) }))).toEqual(['375 /: статус 404, ожидался 200'])
  })

  it('ожидаемый 404 и ожидаемый редирект годны', () => {
    const targets = [
      { path: '/missing/', status: 404 },
      { path: '/cabinet/', status: 307 },
    ]
    const pages = {
      '375 /missing/': page({ status: 404, finalPath: '/missing/' }),
      '375 /cabinet/': page({ status: 307, finalPath: '/' }),
    }
    expect(healthProblems(snapshot(pages, targets))).toEqual([])
  })

  it('неожиданный редирект, незагруженные стили и классы модулей без правил', () => {
    const problems = healthProblems(
      snapshot({
        '375 /': page({
          finalPath: '/login/',
          failedStylesheets: ['/assets/x.css'],
          unstyledModuleClasses: ['_root_ab12c_3'],
        }),
      }),
    )
    expect(problems).toHaveLength(3)
    expect(problems[0]).toMatch(/редирект на \/login\//)
    expect(problems[1]).toMatch(/не загрузились стили/)
    expect(problems[2]).toMatch(/до пересборки \.output/)
  })

  it('страница пропала из снимка или в ней нет элементов', () => {
    const targets = [
      { path: '/', status: 200 },
      { path: '/basket/', status: 200 },
    ]
    const problems = healthProblems(snapshot({ '375 /': page({ elements: {} }) }, targets))
    expect(problems).toEqual(['375 /: в снимке нет элементов', '375 /basket/: страницы нет в снимке'])
  })
})

describe('compareSnapshots и formatReport', () => {
  it('одинаковые снимки: охват и «ОТЛИЧИЙ НЕТ»', () => {
    const report = formatReport(compareSnapshots(snapshot({ '375 /': page() }), snapshot({ '375 /': page() })))
    expect(report).toMatch(/^Охват: 1 страниц×ширин, 2 элементов/)
    expect(report.endsWith('ОТЛИЧИЙ НЕТ')).toBe(true)
  })

  it('считает все отличия без усечения, классы не сравнивает', () => {
    const elements = Object.fromEntries(Array.from({ length: 60 }, (_, i) => [`body>div:${i + 1}`, element()]))
    const changed = Object.fromEntries(
      Object.keys(elements).map((key) => [key, element({ color: 'rgb(1, 1, 1)', cls: 'другой' })]),
    )
    const comparison = compareSnapshots(
      snapshot({ '375 /': page({ elements }) }),
      snapshot({ '375 /': page({ elements: changed }) }),
    )
    expect(comparison.differences).toHaveLength(60)
    expect(formatReport(comparison)).toMatch(/60 {2}color/)
  })

  it('сдвиг структуры и фильтр известного шума', () => {
    const before = snapshot({ '375 /': page({ elements: { body: element(), 'body>div:1': element({ color: 'a' }) } }) })
    const after = snapshot({ '375 /': page({ elements: { body: element(), 'body>p:1': element() } }) })
    const comparison = compareSnapshots(before, after)
    expect(comparison.structural).toEqual([
      { page: '375 /', element: 'body>div:1', side: 'before' },
      { page: '375 /', element: 'body>p:1', side: 'after' },
    ])
    expect(compareSnapshots(before, after, [/body>(div|p):1$/]).structural).toEqual([])
  })

  it('margin при той же геометрии элемента не считается отличием', () => {
    const before = snapshot({ '375 /': page({ elements: { body: element({ 'margin-left': '22.5px' }) } }) })
    const after = snapshot({ '375 /': page({ elements: { body: element({ 'margin-left': '0px' }) } }) })
    const comparison = compareSnapshots(before, after)
    expect(comparison.differences).toEqual([])
    expect(comparison.neutral).toHaveLength(1)
    expect(formatReport(comparison)).toMatch(/Без влияния на геометрию.*: 1\n\nОТЛИЧИЙ НЕТ$/)

    const moved = snapshot({
      '375 /': page({ elements: { body: element({ 'margin-left': '0px', rect: [10, 0, 100, 20] }) } }),
    })
    expect(compareSnapshots(before, moved).differences.map((d) => d.property)).toEqual(['rect', 'margin-left'])
  })

  it('свойство из ignoreProperties не сравнивается, геометрия сравнивается', () => {
    const before = snapshot({ '375 /': page({ elements: { body: element({ 'font-family': 'A' }) } }) })
    const after = snapshot({
      '375 /': page({ elements: { body: element({ 'font-family': 'B', rect: [0, 0, 100, 24] }) } }),
    })
    expect(compareSnapshots(before, after, [], [/^font-family$/]).differences.map((d) => d.property)).toEqual(['rect'])
  })
})
