# 0004. Cookie-сессия вместо next-auth

Дата: 2026-10-15
Статус: accepted

## Контекст

next-auth привязан к Next.js. В `@tanstack/react-start` 1.169 нет `useSession`, готовой сессии из коробки тоже нет. Бэкенд выдаёт access и refresh токены, которые нельзя отдавать в JS браузера.

## Решение

Сессия хранится в httpOnly cookie `rbt_session` (sameSite lax, secure в проде, 30 дней), содержимое шифруется AES-256-GCM, ключ выводится из `SESSION_SECRET` через HKDF (`src/entities/session/api/cookie-seal.server.ts`). Тег аутентификации строго 16 байт. Серверные функции (`auth.functions.ts`) читают и пишут сессию, access-токен обновляется заранее со скосом 60 с (`REFRESH_SKEW_MS`). Защита маршрутов: `_authed` и `_guest` в `beforeLoad`. Возврат после входа: `redirect` с параметром `?redirect=` вместо `callbackUrl`.

## Последствия

- Токены не попадают в клиент, подделка cookie не проходит проверку тега.
- Файлы `*.server.ts` нельзя реэкспортировать из `index.ts` и импортировать в клиентский код.
- Смена `SESSION_SECRET` разлогинивает всех пользователей.
- Шифрование и refresh поддерживаем сами, покрыто тестами.
