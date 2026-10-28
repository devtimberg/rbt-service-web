# 0006. Шторки через staticData.sheet

Дата: 2026-10-15
Статус: superseded by [0013](0013-sheets-in-next.md)

## Контекст

В Next.js шторки работали на parallel route `@sheet` с ручной синхронизацией анимации по pathname. В TanStack Router parallel routes нет.

## Решение

Маршрут, который открывается шторкой, помечается `staticData: { sheet: true }`. `app/layouts/RootLayout` проверяет это через `useMatches`, и `SheetLayout` рисует такую страницу поверх главной в шторке; состояние открытия и анимацию ведёт `useSheetState`.

## Последствия

- Шторка — обычный маршрут: работают прямые ссылки, назад и SSR.
- Новая шторка — это новый маршрут с `staticData.sheet`, без регистрации в общем конфиге.
- Тип `staticData` расширяется в декларации роутера; логика анимации сосредоточена в `app/layouts`.
