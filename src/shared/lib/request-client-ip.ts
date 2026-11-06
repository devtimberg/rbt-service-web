import { isIP } from 'node:net'

/** Только для серверных обработчиков: ingress должен перезаписывать X-Real-IP и закрывать обход прокси. */
export function requestClientIp(request: Request): string | undefined {
  // Next может собрать request.url с внутренним hostname: адрес браузера берём из Host.
  // Прямой локальный запуск поддерживается и для make dev, и для make start.
  const host = request.headers.get('host') ?? new URL(request.url).host
  const local = /^(localhost|127\.0\.0\.1|\[::1\])(?::[0-9]+)?$/.test(host)
  const ip = request.headers.get('x-real-ip')?.trim() || (local ? '127.0.0.1' : '')
  return isIP(ip) ? ip : undefined
}
