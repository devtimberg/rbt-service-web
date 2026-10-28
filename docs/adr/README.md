# Architecture Decision Records

Каждое архитектурное решение фиксируется отдельным файлом. Формат: контекст, решение, последствия. Решение не удаляется, а помечается `superseded` со ссылкой на новое.

| №                                      | Решение                                            | Статус   |
| -------------------------------------- | -------------------------------------------------- | -------- |
| [0001](0001-tanstack-start.md)         | TanStack Start вместо Next.js                      | superseded by 0009 |
| [0002](0002-vite-plus.md)              | Vite+ (vp, Oxlint, Oxfmt) вместо ESLint и Prettier | accepted, частично заменён 0009 |
| [0003](0003-fsd-and-imports.md)        | Упрощённый FSD и правила импортов                  | accepted |
| [0004](0004-cookie-session.md)         | Cookie-сессия вместо next-auth                     | superseded by 0010 |
| [0005](0005-own-ui-primitives.md)      | Свои UI-примитивы без shadcn, Radix и cva          | accepted, частично заменён 0009 |
| [0006](0006-sheets-via-static-data.md) | Шторки через staticData.sheet                      | accepted, заменяется в фазе 2 (0009) |
| [0007](0007-zustand-temporary.md)      | Zustand как временное решение до API               | accepted, частично заменён 0009 |
| [0008](0008-no-bare-html-elements.md)  | Без голых HTML-элементов вне shared/ui             | accepted |
| [0009](0009-nextjs-css-modules-rtk-query.md) | Next.js, CSS Modules, RTK Query, react-hook-form вслед за rbt-web | accepted, в процессе |
| [0010](0010-no-auth-in-mvp.md) | Без авторизации в MVP | accepted |

Шаблон нового ADR: [template.md](template.md).
