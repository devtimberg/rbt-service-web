# pages/ (пустая)

Папка нужна только Next.js: без корневой `pages/` он принял бы FSD-слой `src/pages` за Pages Router и стал бы делать из его файлов маршруты ([ADR 0009](../docs/adr/0009-nextjs-css-modules-rtk-query.md)). Pages Router не используем: маршруты лежат в корневой `app/`, страницы в `src/pages`.

Не добавляйте сюда файлы `.tsx`, `.ts`, `.jsx`, `.js`: каждый станет маршрутом.
