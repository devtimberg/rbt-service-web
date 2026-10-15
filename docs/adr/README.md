# Architecture Decision Records

Каждое архитектурное решение фиксируется отдельным файлом. Формат: контекст, решение, последствия. Решение не удаляется, а помечается `superseded` со ссылкой на новое.

| №                                      | Решение                                            | Статус   |
| -------------------------------------- | -------------------------------------------------- | -------- |
| [0001](0001-tanstack-start.md)         | TanStack Start вместо Next.js                      | accepted |
| [0002](0002-vite-plus.md)              | Vite+ (vp, Oxlint, Oxfmt) вместо ESLint и Prettier | accepted |
| [0003](0003-fsd-and-imports.md)        | Упрощённый FSD и правила импортов                  | accepted |
| [0004](0004-cookie-session.md)         | Cookie-сессия вместо next-auth                     | accepted |
| [0005](0005-own-ui-primitives.md)      | Свои UI-примитивы без shadcn, Radix и cva          | accepted |
| [0006](0006-sheets-via-static-data.md) | Шторки через staticData.sheet                      | accepted |
| [0007](0007-zustand-temporary.md)      | Zustand как временное решение до API               | accepted |

Шаблон нового ADR: [template.md](template.md).
