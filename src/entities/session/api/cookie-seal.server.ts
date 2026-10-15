import { createCipheriv, createDecipheriv, hkdfSync, randomBytes } from 'node:crypto'
import type { SessionData } from '../model/types'

// Формат значения cookie: `v1.<iv>.<tag>.<шифртекст>`, все части в base64url.
// AES-256-GCM: шифрует и подписывает одновременно, подделка или порча значения не пройдёт проверку тега.
const VERSION = 'v1'
const AUTH_TAG_LENGTH = 16

const keyCache = new Map<string, Buffer>()

function deriveKey(secret: string): Buffer {
  let key = keyCache.get(secret)
  if (!key) {
    key = Buffer.from(hkdfSync('sha256', secret, 'rbt-session', 'cookie-aes-256-gcm', 32))
    keyCache.set(secret, key)
  }
  return key
}

type Envelope = { exp: number; data: SessionData }

/** Шифрует сессию в строку для cookie. `ttlMs` — срок жизни, он зашит внутрь (cookie сама по себе не доверенный источник). */
export function sealSession(data: SessionData, secret: string, ttlMs: number, now = Date.now()): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', deriveKey(secret), iv, { authTagLength: AUTH_TAG_LENGTH })
  const envelope: Envelope = { exp: now + ttlMs, data }
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(envelope), 'utf8'), cipher.final()])
  return [VERSION, iv, cipher.getAuthTag(), encrypted]
    .map((part) => (typeof part === 'string' ? part : part.toString('base64url')))
    .join('.')
}

/** Расшифровывает cookie. Любая проблема (формат, подпись, срок) даёт null: пользователь просто считается гостем. */
export function unsealSession(value: string | undefined, secret: string, now = Date.now()): SessionData | null {
  if (!value) return null
  const [version, iv, tag, encrypted, ...rest] = value.split('.')
  if (version !== VERSION || !iv || !tag || !encrypted || rest.length > 0) return null
  try {
    const authTag = Buffer.from(tag, 'base64url')
    // Укороченный тег ослабляет проверку подлинности GCM, поэтому принимаем только полные 16 байт
    if (authTag.length !== AUTH_TAG_LENGTH) return null
    const decipher = createDecipheriv('aes-256-gcm', deriveKey(secret), Buffer.from(iv, 'base64url'), {
      authTagLength: AUTH_TAG_LENGTH,
    })
    decipher.setAuthTag(authTag)
    const plain = Buffer.concat([decipher.update(Buffer.from(encrypted, 'base64url')), decipher.final()])
    const envelope = JSON.parse(plain.toString('utf8')) as Envelope
    if (typeof envelope.exp !== 'number' || envelope.exp <= now) return null
    return envelope.data
  } catch {
    return null
  }
}
