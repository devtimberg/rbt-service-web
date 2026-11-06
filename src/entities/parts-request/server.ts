import { apiFetch, toQueryError } from '@/shared/api'
import { API_ROUTES } from '@/shared/config'
import { requestClientIp } from '@/shared/lib/request-client-ip'
import { createPartsRequestSchema, partsRequestResponseSchema } from './contract'

/** Только фиксированный маршрут и проверенное тело: произвольного проксирования API нет. */
export async function createPartsRequestHandler(request: Request): Promise<Response> {
  const body: unknown = await request.json().catch(() => null)
  const parsed = createPartsRequestSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ code: 'invalid', message: 'Проверьте заполнение полей.' }, { status: 400 })
  }

  const ip = requestClientIp(request)
  if (!ip) {
    return Response.json({ code: 'invalid', message: 'Не удалось определить адрес клиента.' }, { status: 400 })
  }

  try {
    const response = await apiFetch<unknown>(API_ROUTES.PARTS_REQUEST, {
      body: parsed.data,
      headers: { 'X-Real-IP': ip },
      signal: request.signal,
    })
    const result = partsRequestResponseSchema.safeParse(response)
    if (!result.success) {
      return Response.json({ code: 'invalid_response', message: 'Некорректный ответ сервера.' }, { status: 502 })
    }
    return Response.json(result.data)
  } catch (error) {
    const { status, ...body } = toQueryError(error)
    return Response.json(body, { status })
  }
}
