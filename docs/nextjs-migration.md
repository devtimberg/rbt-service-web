# План перехода на Next.js, CSS Modules, RTK Query и react-hook-form

Решение: [ADR 0009](adr/0009-nextjs-css-modules-rtk-query.md). Образец и подробности каждой фазы: `docs/nextjs-migration.md` в rbt-web, он этот путь уже прошёл. Здесь порядок работ и отметки о готовности.

Принципы те же, что у rbt-web: оси меняются по отдельности; после каждого шага приложение работает и `make check` зелёный; вёрстка сверяется `make style-check` с эталоном; общие файлы (`tokens.css`, конфиги, `shared/api`) правятся последовательно до раздачи задач субагентам, каждый субагент отвечает за свой набор папок.

## Фаза 0. Подготовка

- [x] ADR 0009, статусы старых ADR, AGENTS.md без запрета Next.js.
- [x] `make style-check` перенесён из rbt-web, пути под наши адреса (без слэша на конце: `/some-unknown-page@404`).
- [x] Эталон: тег `style-baseline` (раздел «Эталон»).

## Фаза 1. CSS Modules и react-hook-form на текущем стеке (в `main`)

- [x] 1.1. Основа стилей: токены на `:root` (`@theme static`), `@custom-media` через PostCSS ([media.css](../src/shared/ui/media.css), `postcss.config.js`; в `src/styles.css` не работает: его компилирует Tailwind раньше PostCSS), модули `shared/ui` в `@layer components` ниже Tailwind `utilities` (`styles.css` подключается первым и задаёт порядок слоёв; в фазе 2 корневой лайаут Next обязан импортировать его раньше модулей), `scrollbar-none` стал глобальным классом в `@layer components` (вариант `max-sm:scrollbar-none` перестал существовать, `ScrollArea` переписан на произвольные свойства), типы модулей генерирует happy-css-modules в `.css-types/`. `Container` переведён на модуль, внешние `px-*`/`max-w-*` вызывающих мест уточнены брейкпоинтом (`max-md:`), потому что раньше их на md перебивал `md:px-10`; `style-check` без отличий.
- [x] 1.2. `shared/ui` четырьмя группами параллельно, каждая в своём worktree, затем cherry-pick в `main`: раскладка, текст и медиа (Stack, Heading, Skeleton, ScrollArea, Breadcrumb, ClipPathDefs); кнопки и навигация (Button, IconButton, Chip, Pagination); поля и формы (TextInput, TextField/OtpField, FormAlert, Checkbox, RadioGroup); оверлеи (Dialog, Sheet, SheetFooterSlot, LayoutSheet, ConfirmDialog, Popover, Tooltip). `overlay.css` переехал в `Dialog.module.css`. Text, Divider, Image, Box, Field, Form, Input, List, DescriptionList, SmartLink стилей не имели.
  - Значения, которых нет в `tokens.css` (стандартная тема Tailwind: `--spacing`, `--radius-*`, `--shadow-*`, `--text-*`, палитра `gray-*`), записаны литералами: в `:root` они лежат, только пока их использует утилита, а в 1.5 исчезнут совсем. Токены проекта — через `var()`.
  - Вызывающие места: `catalog-filters`, `favorite-filters` (лишний `text-link` у `Button variant="link"`), `MobileBottomNav` (внешний цвет перебивал `aria-current`), поле поиска в `Header` (`max-md:text-base`).
  - Проверка: прод-сборка против `style-baseline`, 12 путей (`/`, каталог, корзина, вызов мастера, вход, регистрация, сброс пароля, избранное, сравнение, поиск, `/profile@307`, 404) × 7 ширин (375–1440), 7962 элемента: отличий нет, кроме `box-shadow` (90 значений; после удаления прозрачных пустых слоёв Tailwind остаётся одно — цвет невидимого кольца 0px). Витрина `/_dev/ui` (dev, 375/768/1440): только `opacity` и хешированное имя `@keyframes` у пульсирующего `Skeleton`. Открытые Dialog, Sheet, Popover, Tooltip сверены отдельным скриптом: отличий нет. hover, focus, invalid сверены построчно, снимком не проверены; кабинет не снят.
  - Найдено и не исправлено (вид должен был сохраниться): фон `FormAlert` ссылается на несуществующий токен `--destructive` и не рисуется; шторка снизу не уважает `prefers-reduced-motion` (оставлено, см. комментарий в `Dialog.module.css`); пульсация `Skeleton` тоже.
- [x] 1.3. `entities`, `features`, `widgets`, `pages`, `app/layouts`. Перед раздачей слой `slices` между `components` и `utilities` (порядок объявлен в начале `src/styles.css`, Lightning CSS его сохраняет): модули слоёв выше `shared/ui` кладут правила туда, и класс слайса, переданный примитиву, перебивает его стиль. Пять групп параллельно, каждая в своём worktree, затем cherry-pick в `main`: корзина; каталог и поиск (`pages/catalog`, `pages/search`, `catalog-search`, `product-card`); лайауты и главная (`app/layouts`, шапка, футер, нижняя навигация, `pages/home`); вызов мастера и избранное; авторизация, профиль и витрина (`features/auth/*`, `AuthShell`, `pages/profile`, `pages/dev`). Tailwind-классы остались только в `routes/__root.tsx` (1.5); глобальный `scrollbar-none` — строкой в `cn()`.
  - После слияния: `line-height: calc(1.25 / 0.875)` и подобные в `Chip` и бейдже `IconButton` (из 1.2) заменены на rem — Chrome считает такие деления с погрешностью (19.984px вместо 20px), чипы сдвигали страницу на 0.016px. В 1.2 это не поймали: чипы были только на страницах вне снимка (`/catalog/<раздел>`, корзина и избранное с товарами). Маркер `group` в шапке снят: поиск привязан к `[data-home]`.
  - Проверка `main` после слияния (прод против `style-baseline`): 13 путей (добавлен `/catalog/refrigerators`) × 7 ширин, 11475 элементов — отличий нет (повтором; разовый сдвиг точек печати в футере — анимация); `box-shadow` без прозрачных слоёв — 0. Скрипты состояний агентов прогнаны против объединённой сборки: корзина с товарами и диалоги удаления, фильтры и выпадающий поиск каталога, бейджи корзины и избранного, шторка и поповер футера, шаги вызова мастера и избранное с товарами, ошибки форм входа, регистрации и сброса — отличий нет, кроме кадра спиннера ожидания звонка и точек печати. Профиль и смена пароля сверены временным dev-маршрутом с фикстурой (удалён). Витрина в dev — только пульсация `Skeleton`.
  - Не проверено: шаги с OTP (регистрация, сброс пароля) — открываются только после ответа API; hover, focus и active — построчно по коду; правила главной по высоте окна (700/860/900) — только при высоте 900.
  - Найдено и не исправлено (вид сохранён): `StepSuccess` вызова мастера недостижим (`setStep(3)` нигде не вызывается); `hover:text-primary-700` у ссылок каталога не работал (токена нет); `animation-duration-[450ms]` каретки футера не существовал (пульс 2s); `[@media(max-height:760px)]` на главной всегда перебивался правилом 860px; спиннер ожидания звонка не уважает `prefers-reduced-motion`.
- [x] 1.4. Формы на react-hook-form: свелась к удалению авторизации ([ADR 0010](adr/0010-no-auth-in-mvp.md)), других форм в приложении нет (у вызова мастера выбор плитками, без полей). `react-hook-form` и `@hookform/resolvers` установлены, соглашения в AGENTS.md («Формы») — для будущих форм; любую новую форму сначала согласуем. Удалено: маршруты `_authed`/`_guest`, `features/auth/*`, `pages/auth`, `pages/profile`, `entities/session`, `useFormValues`, `useResendCountdown`, иконка профиля, `SESSION_SECRET`/`TRUST_PROXY`, auth-части `shared/api`. Прод стартует без `SESSION_SECRET`; `/login`, `/signup`, `/password-reset`, `/profile` отдают 404. Сверка с эталоном: отличия только в шапке (нет иконки профиля, поиск на md шире) и нижней навигации (четыре вкладки), просмотрено глазами.
- [ ] 1.5. Удалить Tailwind, `@tailwindcss/vite`, `tailwind-merge`; `cn()` становится `clsx`.

## Фаза 2. Next.js App Router (своя ветка)

- [ ] ADR о менеджере пакетов и рантайме (Bun или pnpm с Node 24) и об именах файлов (kebab-case, папка на компонент).
- [ ] Маршруты в корневой `app/`, пустая `pages/` с README, лайауты в `src/app/layouts`.
- [ ] Шторки без `staticData` (замена [0006](adr/0006-sheets-via-static-data.md)).
- [ ] Удалить TanStack Start, TanStack Router, Nitro.

## Фаза 3. RTK Query (своя ветка от `main`)

- [ ] Стор на запрос, `Hydrate` по сегментам, эндпоинты в `entities/<entity>/api.ts`.
- [ ] Удалить TanStack Query.

## Эталон

Локальный тег `style-baseline` — последний коммит фазы 0, вёрстка до CSS Modules. Две копии этой сборки сравниваются без отличий (25 страниц×ширин, 2878 элементов), то есть шума в снимке нет и любое отличие означает изменение вёрстки.

Поднять эталон и сравнить с текущей сборкой:

```bash
git worktree add ../rbt-service-web-ref style-baseline
cd ../rbt-service-web-ref && bun install && make build && PORT=3210 node --env-file-if-exists=.env .output/server/index.mjs
# в основном каталоге: make build && PORT=3200 node --env-file-if-exists=.env .output/server/index.mjs
make style-check REF=http://localhost:3210 TARGET=http://localhost:3200
```

`.env` в worktree не попадает: скопируй его из основного каталога. Сравнивай прод-сборки, не dev. Анимации в снимке выключены эмуляцией `prefers-reduced-motion: reduce`, поэтому любая анимация должна её уважать (`motion-safe:` в Tailwind, `@media (prefers-reduced-motion: no-preference)` в модулях), иначе она даёт шум в отчёте.
