// Проверка сообщения коммита на Conventional Commits (без commitlint).
// Вызывается из lefthook: первым аргументом приходит путь к файлу сообщения.
import { readFileSync } from 'node:fs'

const file = process.argv[2]
if (!file) {
  console.error('Не передан путь к файлу сообщения коммита')
  process.exit(2)
}

const firstLine = readFileSync(file, 'utf8').split('\n')[0] ?? ''

// Служебные сообщения git пропускаем
if (/^(Merge|Revert|fixup!|squash!)/.test(firstLine)) process.exit(0)

const types = 'feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert'
const pattern = new RegExp(`^(${types})(\\([a-z0-9-]+\\))?!?: .{1,100}$`)

if (!pattern.test(firstLine)) {
  console.error(`Сообщение не соответствует Conventional Commits:\n  ${firstLine}\n`)
  console.error('Формат: <тип>(<область>)?: <описание>, например "feat(cart): добавить кнопку".')
  console.error(`Типы: ${types.replaceAll('|', ', ')}`)
  process.exit(1)
}
