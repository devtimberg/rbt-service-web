# План перехода на Next.js, CSS Modules, RTK Query и react-hook-form

Решение: [ADR 0009](adr/0009-nextjs-css-modules-rtk-query.md). Образец и подробности каждой фазы: `docs/nextjs-migration.md` в rbt-web, он этот путь уже прошёл. Здесь порядок работ и отметки о готовности.

Принципы те же, что у rbt-web: оси меняются по отдельности; после каждого шага приложение работает и `make check` зелёный; вёрстка сверяется `make style-check` с эталоном; общие файлы (`tokens.css`, конфиги, `shared/api`) правятся последовательно до раздачи задач субагентам, каждый субагент отвечает за свой набор папок.

## Фаза 0. Подготовка

- [x] ADR 0009, статусы старых ADR, AGENTS.md без запрета Next.js.
- [x] `make style-check` перенесён из rbt-web, пути под наши адреса (без слэша на конце: `/some-unknown-page@404`).
- [x] Эталон: тег `style-baseline` (раздел «Эталон»).

## Фаза 1. CSS Modules и react-hook-form на текущем стеке (в `main`)

- [x] 1.1. Основа стилей: токены на `:root` (`@theme static`), `@custom-media` через PostCSS ([media.css](../src/shared/ui/media.css), `postcss.config.js`; в `src/styles.css` не работает: его компилирует Tailwind раньше PostCSS), модули `shared/ui` в `@layer components` ниже Tailwind `utilities` (`styles.css` подключается первым и задаёт порядок слоёв; в фазе 2 корневой лайаут Next обязан импортировать его раньше модулей), `scrollbar-none` стал глобальным классом в `@layer components` (вариант `max-sm:scrollbar-none` перестал существовать, `ScrollArea` переписан на произвольные свойства), типы модулей генерирует happy-css-modules в `.css-types/`. `Container` переведён на модуль, внешние `px-*`/`max-w-*` вызывающих мест уточнены брейкпоинтом (`max-md:`), потому что раньше их на md перебивал `md:px-10`; `style-check` без отличий.
- [x] 1.2. `shared/ui` четырьмя группами параллельно, каждая в своём worktree, затем cherry-pick в `main`: раскладка, текст и медиа (Stack, Heading, Skeleton, ScrollArea, Breadcrumb, ClipPathDefs); кнопки и навигация (Button, IconButton, Chip, Pagination); поля и формы (TextInput, TextField/OtpField, FormAlert, Checkbox, RadioGroup); оверлеи (Dialog, Sheet, SheetFooterSlot, LayoutSheet, ConfirmDialog, Popover, Tooltip). `overlay.css` переехал в `dialog/dialog.module.css`. Text, Divider, Image, Box, Field, Form, Input, List, DescriptionList, SmartLink стилей не имели.
  - Значения, которых нет в `tokens.css` (стандартная тема Tailwind: `--spacing`, `--radius-*`, `--shadow-*`, `--text-*`, палитра `gray-*`), записаны литералами: в `:root` они лежат, только пока их использует утилита, а в 1.5 исчезнут совсем. Токены проекта — через `var()`.
  - Вызывающие места: `catalog-filters`, `favorite-filters` (лишний `text-link` у `Button variant="link"`), `MobileBottomNav` (внешний цвет перебивал `aria-current`), поле поиска в `Header` (`max-md:text-base`).
  - Проверка: прод-сборка против `style-baseline`, 12 путей (`/`, каталог, корзина, вызов мастера, вход, регистрация, сброс пароля, избранное, сравнение, поиск, `/profile@307`, 404) × 7 ширин (375–1440), 7962 элемента: отличий нет, кроме `box-shadow` (90 значений; после удаления прозрачных пустых слоёв Tailwind остаётся одно — цвет невидимого кольца 0px). Витрина `/_dev/ui` (dev, 375/768/1440): только `opacity` и хешированное имя `@keyframes` у пульсирующего `Skeleton`. Открытые Dialog, Sheet, Popover, Tooltip сверены отдельным скриптом: отличий нет. hover, focus, invalid сверены построчно, снимком не проверены; кабинет не снят.
  - Найдено и не исправлено (вид должен был сохраниться): фон `FormAlert` ссылается на несуществующий токен `--destructive` и не рисуется; шторка снизу не уважает `prefers-reduced-motion` (оставлено, см. комментарий в `dialog/dialog.module.css`); пульсация `Skeleton` тоже.
- [x] 1.3. `entities`, `features`, `widgets`, `pages`, `app/layouts`. Перед раздачей слой `slices` между `components` и `utilities` (порядок объявлен в начале `src/styles.css`, Lightning CSS его сохраняет): модули слоёв выше `shared/ui` кладут правила туда, и класс слайса, переданный примитиву, перебивает его стиль. Пять групп параллельно, каждая в своём worktree, затем cherry-pick в `main`: корзина; каталог и поиск (`pages/catalog`, `pages/search`, `catalog-search`, `product-card`); лайауты и главная (`app/layouts`, шапка, футер, нижняя навигация, `pages/home`); вызов мастера и избранное; авторизация, профиль и витрина (`features/auth/*`, `AuthShell`, `pages/profile`, `pages/dev`). Tailwind-классы остались только в `routes/__root.tsx` (1.5); глобальный `scrollbar-none` — строкой в `cn()`.
  - После слияния: `line-height: calc(1.25 / 0.875)` и подобные в `Chip` и бейдже `IconButton` (из 1.2) заменены на rem — Chrome считает такие деления с погрешностью (19.984px вместо 20px), чипы сдвигали страницу на 0.016px. В 1.2 это не поймали: чипы были только на страницах вне снимка (`/catalog/<раздел>`, корзина и избранное с товарами). Маркер `group` в шапке снят: поиск привязан к `[data-home]`.
  - Проверка `main` после слияния (прод против `style-baseline`): 13 путей (добавлен `/catalog/refrigerators`) × 7 ширин, 11475 элементов — отличий нет (повтором; разовый сдвиг точек печати в футере — анимация); `box-shadow` без прозрачных слоёв — 0. Скрипты состояний агентов прогнаны против объединённой сборки: корзина с товарами и диалоги удаления, фильтры и выпадающий поиск каталога, бейджи корзины и избранного, шторка и поповер футера, шаги вызова мастера и избранное с товарами, ошибки форм входа, регистрации и сброса — отличий нет, кроме кадра спиннера ожидания звонка и точек печати. Профиль и смена пароля сверены временным dev-маршрутом с фикстурой (удалён). Витрина в dev — только пульсация `Skeleton`.
  - Не проверено: шаги с OTP (регистрация, сброс пароля) — открываются только после ответа API; hover, focus и active — построчно по коду; правила главной по высоте окна (700/860/900) — только при высоте 900.
  - Найдено и не исправлено (вид сохранён): ~~`StepSuccess` вызова мастера недостижим~~ (потеряло смысл: старый сценарий удалён в этапе 3 MVP); `hover:text-primary-700` у ссылок каталога не работал (токена нет); `animation-duration-[450ms]` каретки футера не существовал (пульс 2s); `[@media(max-height:760px)]` на главной всегда перебивался правилом 860px; спиннер ожидания звонка не уважает `prefers-reduced-motion`.
- [x] 1.4. Формы на react-hook-form: свелась к удалению авторизации ([ADR 0010](adr/0010-no-auth-in-mvp.md)), других форм в приложении нет (у вызова мастера выбор плитками, без полей). `react-hook-form` и `@hookform/resolvers` установлены, соглашения в AGENTS.md («Формы») — для будущих форм; любую новую форму сначала согласуем. Удалено: маршруты `_authed`/`_guest`, `features/auth/*`, `pages/auth`, `pages/profile`, `entities/session`, `useFormValues`, `useResendCountdown`, иконка профиля, `SESSION_SECRET`/`TRUST_PROXY`, auth-части `shared/api`. Прод стартует без `SESSION_SECRET`; `/login`, `/signup`, `/password-reset`, `/profile` отдают 404. Сверка с эталоном: отличия только в шапке (нет иконки профиля, поиск на md шире) и нижней навигации (четыре вкладки), просмотрено глазами.
- [x] 1.5. Tailwind, `@tailwindcss/vite`, `tailwind-merge` удалены, `cn()` — `clsx`. Свой сброс `src/app/styles/reset.css` (preflight Tailwind 4.3, MIT), глобальные стили `src/app/styles/global.css` (слои `base, components, slices`; правила `body` из `__root.tsx`; `@custom-media` теперь работают и тут), `src/styles.css` удалён. Токены: `@theme static` → `:root`; переменные стандартной темы, на которые ссылались модули, стали токенами (`--spacing`, `--text-xs…lg` с высотой строки, `--radius-2xl`, `--font-weight-normal/medium`, `--default-transition-*`) или литералами; неопределённых ссылок нет (кроме `--icon-size`, его ставит inline-стиль `IconButton`). Из модулей убраны артефакты Tailwind: пустые слои теней, `--tw-*` в `transition-property`, `calc(infinity * 1px)` → `9999px`. Страницы 404 и ошибки переехали из `__root.tsx` в `pages/not-found` и `pages/error`, маршруты без вёрстки.
  - Проверка: прод-сборки до 1.5 (`58872cf`) и после, 9 путей × 5 ширин, 6180 элементов — отличия только ожидаемые от чистки (`transition-property` 295, радиусы 620 «огромное число → 9999px», одно нулевое кольцо `box-shadow` → `none`) и разовый сдвиг точек печати в футере; без этих свойств — отличий нет. Скрипты состояний (корзина, мастер, лайаут, каталог) и витрина в dev — то же. Главная и корзина просмотрены глазами. CSS прод-сборки 72,7 → 65,0 КБ (gzip 14,4 → 12,9 КБ). Страница ошибки маршрута вживую не открывалась.

## Фаза 2. Next.js App Router (своя ветка `migrate/nextjs`)

- [x] ADR 0011 (pnpm, Node 24) сделан до фазы 2, ADR 0012 (kebab-case, папка на компонент) тоже.
- [x] Маршруты в корневой `app/`, пустая `pages/` с README, лайауты в `src/app/layouts`.
- [x] Шторки без `staticData` (замена [0006](adr/0006-sheets-via-static-data.md), [0013](adr/0013-sheets-in-next.md)).
- [x] Удалить TanStack Start, TanStack Router, Nitro.

### Итог фазы 2 (2026-10-29, Next.js 16.4.3)

Как сделано:
- **Маршруты.** `app/layout.tsx` (`<html lang="ru-RU">`, `global.css` первым импортом, `metadata` из прежнего `__root.tsx`, `force-dynamic`), `app/{page,cart,favorite,compare,master-call,search}`, `app/catalog/page.tsx` и `app/catalog/[...slug]/page.tsx` (подразделы), `app/not-found.tsx`, `app/error.tsx`, `app/%5Fdev/ui/page.tsx` (папка `%5F`: имя с `_` Next считает приватным; в проде `notFound()`, `/_dev/ui` отдаёт 404). В `page.tsx` только `metadata` и компонент из `src/pages`. Заголовки страниц те же, что были в `head` маршрутов. Адреса без слэша на конце, `trailingSlash` не включали.
- **Шторки** ([0013](adr/0013-sheets-in-next.md)): признак по пути `isSheetPath` в `shared/config`, корневой клиентский `RootLayout` кладёт `children` в основной контент или в `SheetLayout`. Группа маршрутов и `@sheet` с перехватом не нужны: нужное поведение (анимация закрытия, фон) даёт общий лайаут, а `useSheetState` не менялся.
- **Данные.** `QueryClient` в `useState` клиентского `AppProviders` (`src/app/root`): на запрос при SSR, на вкладку в браузере. Данных в `app/` пока нет (страницы на моках), Server Actions и `fetch` Next нет. `API_INTERNAL_URL` читает только сервер (`getServerEnv`, проверка `typeof window`, прежняя `import.meta.env.SSR` в Next не существует); в браузер ничего не передаётся.
- **Шрифт.** Inter через `next/font/local` из `@fontsource-variable/inter`, четыре подмножества (латиница и кириллица с preload, их расширения без) как отдельные семейства; `--font-sans` в `tokens.css` перечисляет их. `@import` пакета из `global.css` убран.
- **`'use client'`.** Директива в `shared/ui` (tooltip, checkbox, dialog, popover, radio-group, sheet, sheet-footer-slot, smart-link), `shared/lib` (use-media-query, use-persist-hydrated, use-sticky-scroll, use-pathname, browser-storage), сторах (`entities/cart`, `entities/favorite`, `features/search-products`), частях `widgets` (header, footer, catalog-search), `pages` (входы страниц и их дочерние с состоянием), `app/layouts`. Нужные места показывала `next build` («importing a module that depends on …»); `not-found` импортирует барель `@/shared/ui`, поэтому весь UI-кит с контекстом обязан быть клиентским.
- **Адрес.** `usePathname` в `shared/lib/use-pathname` на `next/navigation` с `?? ''` (корневая `pages/` делает тип nullable; вне роутера в тестах хук отдаёт `null`, строка пустая, как раньше). Header и `StepSuccess`: `useRouter` из `next/navigation` (`back()`, `push(ROUTES.HOME)`). `SmartLink` на `next/link` с `prefetch={false}`: внутренние адреса теперь все клиентские, раньше без маршрута в роутере были `<a>`.
- **Next-конфиг.** `output: 'standalone'`, `compress`, `images.unoptimized`, `agentRules: false`, `typescript.ignoreBuildErrors` (типы проверяет `make check`), `headers()` с `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` (раньше `routeRules` Nitro), `experimental.staleTimes.dynamic = 300` (переход на уже открытую шторку без запроса). Заметный нюанс: `browserslist` в `package.json` (Chrome и Edge 111, Firefox 114, Safari 16.4): без него Lightning CSS Next превращал `oklch()` токенов в `lab()` под `@supports` (Firefox до 113 не знает oklch) и computed-цвета отличались от эталона; с ним CSS идентичен.
- **PostCSS** из фазы 1 (`@csstools/postcss-global-data`, `postcss-custom-media`) работает в Next без правок: в собранном CSS нет ни одного `@media (--`, все брейкпоинты раскрыты.
- **Инструменты.** Скрипты `dev` (`next dev` + типы CSS-модулей в фоне), `build` (`next build` + копирование `public` и `.next/static` в standalone), `start` (`node .next/standalone/server.js`), `types:gen` (`next typegen` перед `tsc` и линтом). Makefile, Dockerfile (standalone, `node server.js`, Node 24), `next-env.d.ts` и `.next` в `.gitignore`/`.dockerignore`. `vite.config.ts` без плагинов Start/Nitro/React, слой `routes` убран из правил, плагин Oxlint `nextjs` без `no-img-element` и `no-html-link-for-pages`, для `app/**` запрещены относительные импорты. steiger без исключений `src/routes`. `vitest.config.ts` оставил `@vitejs/plugin-react` (JSX в тестах). Компонентные тесты от роутера TanStack не зависели (рендер вне роутера), провайдер App Router для тестов не понадобился.
- **style-check**: узнаёт классы Next (`<хеш>_<имя>`) и пропускает служебные узлы уже со времён фазы 0 (перенесён из rbt-web), правок не потребовалось. Скрипты состояний (корзина, мастер, лайаут, каталог) в части обхода дерева надо учить пропускать `next-route-announcer` и скрытый `div` первым в `body`.

Проверка (прод-сборка `main` на 3260 против ветки на 3270):
- `make check` зелёный (typecheck, lint 200 файлов, steiger, 99 тестов), `next build`: все 10 маршрутов `ƒ (Dynamic)`, `/_dev/ui` в проде 404, `/` и 8 страниц 200, неизвестный адрес 404.
- `make style-check`, 9 путей (`/`, `/catalog`, `/catalog/refrigerators`, `/cart`, `/master-call`, `/favorite`, `/compare`, `/search`, 404) × 375, 640, 768, 1024, 1440, `--ignore-prop font-family`: отличий нет, кроме одной точки печати в футере корзины на 640 (`rect` 286,5 → 291,5, известный шум).
- Состояния: корзина (6 состояний × 3 ширины) без отличий кроме точек печати; мастер вызова: спиннер ожидания (кадр анимации) и переходный `background-color` кнопки на шаге 2; лайаут (32 состояния × ширины, 4206 элементов): 0; каталог и поиск (13 состояний, фильтры, выпадающий поиск): 0.
- Шторки (Playwright, 375 и 1440): 89 проверок (прямой заход на 7 адресов, клик с главной, «назад», «вперёд», Escape, шторка → шторка, прокрутка, закрытие мастера крестиком, 404) дают один и тот же URL, заголовок, состояние шторки, видимость и геометрию, отличаются 7 значений `y` шторки на 150 мс закрытия (кадр анимации).
- Витрина в dev (3370 против 3360, 375/768/1440): отличается только пульсация `Skeleton`.
- Docker: образ собирается, контейнер отвечает `/` 200, `/cart` 200, `/_dev/ui` 404; образ и контейнер удалены.
- Гидрация: прод, корзина и избранное в `localStorage`, 6 адресов: ошибок консоли нет (zustand `skipHydration` и `rehydrate` в эффекте как раньше).
- HTML (прод, байты без сжатия): главная 28,2 → 30,2 КиБ, каталог 22,7 → 25,3, корзина 13,9 → 16,9 (Next добавляет служебный RSC-поток `self.__next_f`). С gzip встроенного сервера Next: 8,1, 6,9, 5,3 КиБ (эталон отдаёт без сжатия). JS всех чанков 535 → 856 КиБ (gzip 169 → 258), CSS 63,3 → 66,2 КиБ (gzip 12,7 → 12,7): рантайм Next и роутера против TanStack.

Выводы для фазы 3:
- серверный граф Next тянет все модули барелей: новый модуль с хуками сразу помечать `'use client'`, эндпоинты RTK Query держать в файлах без хуков;
- `usePathname` и подобные хуки брать из обёрток `shared/lib`, не из `next/navigation`;
- переход между страницами теперь ждёт ответ сервера (в TanStack роутер переключался сразу): когда в `page.tsx` появятся запросы, их нельзя класть в сам RSC-ответ без `loading`, иначе шторка откроется с задержкой на API;
- `typecheck`, `lint` и `dev` уже запускают `next typegen` и генерацию типов CSS-модулей: новые команды делать так же.

## Фаза 3. RTK Query (своя ветка от `main`)

- [x] Основа: `api` и `makeStore()` в `shared/api`, `StoreProvider` в `app/root`, `renderWithStore` в `@/shared/api/testing`.
- [x] Удалить TanStack Query.
- [x] Техдолг, найденный при сверке вёрстки в фазе 1 (2026-10-29): фон `FormAlert` (`--color-danger-100`); `prefers-reduced-motion` у шторки снизу `Dialog`, `LayoutSheet`, `Skeleton`, спиннеров `Button` и ожидания звонка; hover ссылок каталога (`--color-primary-900`). Правило главной `max-height: 760px` уже удалено. `StepSuccess` вызова мастера оставлен недостижимым до API: шаг 3 включит подтверждение звонка.
- [ ] Эндпоинты в `entities/<entity>/api.ts`, стор на запрос и `Hydrate` по сегментам, `prefetch`: с первым эндпоинтом, когда появится API (образец: rbt-web, раздел «Итог фазы 3»). Сейчас это был бы мёртвый код.

### Итог фазы 3 (2026-10-29, RTK Query 2.13, react-redux 9.3)

Как сделано:
- TanStack Query в коде не использовался (только провайдер), поэтому фаза свелась к основе. `shared/api`: `api` (`createApi`, `fakeBaseQuery`, `reducerPath: 'api'`, без эндпоинтов), `makeStore()` (редьюсер и middleware `api`), типы `AppStore`, `RootState`, `AppDispatch`; всё в `index.ts` слайса. `src/app/root/store-provider.tsx` (`'use client'`, `useState(makeStore)`) вместо `QueryClientProvider` в `AppProviders`. `@tanstack/react-query` удалён, в `src` и `package.json` `@tanstack` нет.
- Тесты: `store.test.tsx` (редьюсер `api` подключён, сторы независимы, `renderWithStore` отдаёт стор), `store-provider.test.tsx`; `renderWithStore` и `createTestStore` в `@/shared/api/testing`, не из `index.ts`.
- Не делали намеренно (без эндпоинтов это мёртвый код): `prefetch`, `Hydrate`, стор на запрос на сервере, `extraArgument` с клиентами, тип ошибки `QueryError`. Образец rbt-web (`src/shared/api/`): стор на запрос через `cache` React, `<Hydrate>` по сегментам, `prefetch` в `page.tsx`, эндпоинты в `entities/<entity>/api.ts` через `injectEndpoints`, `queryFn` поверх клиента. Правило записано в AGENTS.md, раздел «Состояние».

Проверка (прод-сборка `main` на 3281 против ветки на 3280):
- `make check` зелёный (102 теста), `make build` проходит, все маршруты `ƒ (Dynamic)`; `/`, `/catalog`, `/cart` отдают 200.
- `make style-check --widths 375,1440`: ОТЛИЧИЙ НЕТ.
- Гидрация (Playwright, прод, `/` и `/cart`): ошибок и предупреждений консоли нет.
- HTML без изменений: главная 30 932 байта, каталог 25 862, корзина 17 342 (до и после одинаково). JS в `.next/static` 877 212 → 924 208 байт (+46 КиБ, Redux Toolkit и react-redux в клиентском бандле).

## Эталон

Локальный тег `style-baseline` — последний коммит фазы 0, вёрстка до CSS Modules. Две копии этой сборки сравниваются без отличий (25 страниц×ширин, 2878 элементов), то есть шума в снимке нет и любое отличие означает изменение вёрстки.

Поднять эталон и сравнить с текущей сборкой:

```bash
git worktree add ../rbt-service-web-ref style-baseline
cd ../rbt-service-web-ref && bun install --frozen-lockfile && make build && PORT=3210 node --env-file-if-exists=.env .output/server/index.mjs
# тег style-baseline старше ADR 0011: там ещё Bun (bun.lock), поэтому эталон ставится через bun, а не pnpm
# в основном каталоге (Next, standalone): make build && PORT=3200 make start
make style-check REF=http://localhost:3210 TARGET=http://localhost:3200
```

`.env` в worktree не попадает: скопируй его из основного каталога. Сравнивай прод-сборки, не dev. Анимации в снимке выключены эмуляцией `prefers-reduced-motion: reduce`, поэтому любая анимация должна её уважать (`motion-safe:` в Tailwind, `@media (prefers-reduced-motion: no-preference)` в модулях), иначе она даёт шум в отчёте.
