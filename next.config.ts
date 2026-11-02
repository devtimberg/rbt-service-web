import type { NextConfig } from 'next'
import { LOCKED_SECTIONS, LOCKED_SECTION_NOTICE_PARAM, ROUTES } from './src/shared/config/index'

// Next.js App Router (ADR 0009, 0013). Маршруты в корневой app/, UI в src/ (FSD), PostCSS из postcss.config.js.
const config: NextConfig = {
  // Node-сервер без node_modules проекта: .next/standalone/server.js (см. Dockerfile)
  output: 'standalone',
  // Доступ к dev-ресурсам и HMR с устройств в локальной сети: впиши свои origins при разработке с телефона,
  // личные адреса в общий конфиг не коммитим (см. README, «Установка и запуск»).
  allowedDevOrigins: ['192.168.1.88'],
  outputFileTracingIncludes: {
    '/privacy-policy': ['./src/pages/privacy-policy/content/*.md'],
  },
  // gzip встроенного сервера
  compress: true,
  poweredByHeader: false,
  // Своя Image в shared/ui, оптимизация картинок в Node-процессе не нужна
  images: { unoptimized: true },
  // next dev не дописывает свой блок в AGENTS.md: правила для агентов ведём сами
  agentRules: false,
  // Линт и типы проверяет make check (Oxlint, tsc), не сборка
  typescript: { ignoreBuildErrors: true },
  // MVP: закрытые страницы и подразделы не отдаются даже по прямой ссылке.
  redirects: async () =>
    LOCKED_SECTIONS.map((section) => ({
      source: `${section}/:path*`,
      destination: `${ROUTES.HOME}?${LOCKED_SECTION_NOTICE_PARAM}=1`,
      permanent: false,
    })),
  // Заголовки, которые раньше ставил Nitro (routeRules)
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
  ],
  // Кэш роутера в браузере: повторный переход на страницу в течение 5 минут без запроса к серверу.
  // Данных в RSC-ответе страниц нет (шторки статичны), HTML сервер не кэширует (force-dynamic)
  experimental: { staleTimes: { dynamic: 5 * 60 } },
}

export default config
