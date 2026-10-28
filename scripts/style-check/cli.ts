// Сравнение вёрстки двух сборок по снимкам стилей Запуск: make style-check.
//   bun scripts/style-check/cli.ts compare --ref <url> --target <url> [опции] [путь ...]
//       снимает обе сборки одновременно (одни данные API) и сравнивает все элементы полностью
//   bun scripts/style-check/cli.ts snapshot --url <url> --out <file.json> [опции] [путь ...]
//   bun scripts/style-check/cli.ts diff <before.json> <after.json> [--ignore <regex>]
// Пути: `/cart`, ожидаемый статус через `@`: `/some-unknown-page@404`, `/profile@307` (у нас адреса без слэша на конце: слэш перед `@` входит в путь). Без путей: DEFAULT_PATHS.
// Опции: --widths 375,1440  --no-scroll  --ignore <regex> (повторяемая, по `<ширина> <путь> <элемент>`)
//   --ignore-prop <regex> (повторяемая, по имени свойства)  --module-class <regex>  --out-dir <dir>
// Выход: 0 — отличий нет, 1 — есть отличия, 2 — снимок негоден (404 вместо страницы, редирект, стили не загрузились,
// классы модулей без правил, путь с пробелом) или ошибка аргументов. «Отличий нет» печатается только для годных снимков.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseArgs } from 'node:util'
import { chromium } from '@playwright/test'
import { compareSnapshots, formatReport, healthProblems, parseTargets, type Snapshot } from './analyze'
import { DEFAULT_WIDTHS, takeSnapshot } from './snapshot'

/** Страницы по умолчанию: главная, каталог, корзина, вызов мастера, 404. Служебная /_dev/ui есть только в dev-сборке. */
const DEFAULT_PATHS = ['/', '/catalog', '/cart', '/master-call', '/some-unknown-page@404']

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    ref: { type: 'string' },
    target: { type: 'string' },
    url: { type: 'string' },
    out: { type: 'string' },
    'out-dir': { type: 'string', default: '.style-check' },
    widths: { type: 'string' },
    'no-scroll': { type: 'boolean', default: false },
    ignore: { type: 'string', multiple: true, default: [] },
    'ignore-prop': { type: 'string', multiple: true, default: [] },
    'module-class': { type: 'string' },
  },
})

const [command, ...rest] = positionals

try {
  process.exitCode = await run()
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 2
}

async function run(): Promise<number> {
  const ignore = (values.ignore ?? []).map((source) => new RegExp(source))
  const ignoreProperties = (values['ignore-prop'] ?? []).map((source) => new RegExp(source))
  const common = {
    widths: values.widths ? values.widths.split(',').map(Number) : DEFAULT_WIDTHS,
    scroll: !values['no-scroll'],
    ...(values['module-class'] ? { moduleClass: new RegExp(values['module-class']) } : {}),
  }

  if (command === 'snapshot') {
    if (!values.url || !values.out) throw new Error('snapshot: нужны --url и --out')
    const snapshot = await takeSnapshot({ baseUrl: values.url, targets: parseTargets(withDefaults(rest)), ...common })
    writeFileSync(values.out, JSON.stringify(snapshot))
    return reportHealth('снимок', snapshot) ? 0 : 2
  }

  if (command === 'diff') {
    const [beforeFile, afterFile] = rest
    if (!beforeFile || !afterFile) throw new Error('diff: нужны два файла снимков')
    return compareAndReport(read(beforeFile), read(afterFile), ignore, ignoreProperties)
  }

  if (command === 'compare') {
    if (!values.ref || !values.target) throw new Error('compare: нужны --ref и --target')
    if (new URL(values.ref).origin === new URL(values.target).origin) {
      throw new Error('compare: --ref и --target указывают на один сервер, сравнение с самим собой всегда даст ноль')
    }
    const targets = parseTargets(withDefaults(rest))
    const browser = await chromium.launch()
    try {
      // Одновременно, чтобы обе сборки получили одни и те же данные API
      const [before, after] = await Promise.all([
        takeSnapshot({ baseUrl: values.ref, targets, ...common }, browser),
        takeSnapshot({ baseUrl: values.target, targets, ...common }, browser),
      ])
      const dir = values['out-dir'] ?? '.style-check'
      mkdirSync(dir, { recursive: true })
      writeFileSync(join(dir, 'ref.json'), JSON.stringify(before))
      writeFileSync(join(dir, 'target.json'), JSON.stringify(after))
      console.log(`Снимки: ${join(dir, 'ref.json')}, ${join(dir, 'target.json')}`)
      return compareAndReport(before, after, ignore, ignoreProperties, join(dir, 'report.txt'))
    } finally {
      await browser.close()
    }
  }

  throw new Error('Команда: compare | snapshot | diff (см. заголовок scripts/style-check/cli.ts)')
}

function withDefaults(paths: string[]): string[] {
  return paths.length > 0 ? paths : DEFAULT_PATHS
}

function read(file: string): Snapshot {
  return JSON.parse(readFileSync(file, 'utf8')) as Snapshot
}

/** Печатает проблемы снимка; true, если снимок годен для сравнения. */
function reportHealth(label: string, snapshot: Snapshot): boolean {
  const problems = healthProblems(snapshot)
  if (problems.length === 0) return true
  console.error(`СНИМОК НЕГОДЕН (${label}, ${snapshot.meta.baseUrl}):\n  ${problems.join('\n  ')}`)
  return false
}

function compareAndReport(
  before: Snapshot,
  after: Snapshot,
  ignore: RegExp[],
  ignoreProperties: RegExp[],
  reportFile?: string,
): number {
  const healthy = [reportHealth('эталон', before), reportHealth('проверяемая сборка', after)].every(Boolean)
  if (!healthy) return 2
  const report = formatReport(compareSnapshots(before, after, ignore, ignoreProperties))
  if (reportFile) writeFileSync(reportFile, report)
  console.log(report)
  return report.endsWith('ОТЛИЧИЙ НЕТ') ? 0 : 1
}
