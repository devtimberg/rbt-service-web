'use client'

import { useRouter } from 'next/navigation'
import { createContext, type ReactNode, use, useCallback, useEffect, useEffectEvent, useRef, useState } from 'react'

type Blocker = { discard: () => void }
type NavigationGuard = {
  register: (blocker: Blocker) => () => void
  request: (action: () => void) => void
  navigate: (href: string) => void
  pending: boolean
  cancel: () => void
  confirm: () => void
}

const GuardContext = createContext<NavigationGuard | null>(null)
const BASE_KEY = '__rbtFormBase'
const TOP_KEY = '__rbtFormTop'

/** Локальное UI-состояние подтверждения навигации; данные формы здесь не хранятся. */
export function NavigationGuardProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const blocker = useRef<Blocker | null>(null)
  const [action, setAction] = useState<(() => void) | null>(null)
  const restoring = useRef(false)
  const skipping = useRef(false)

  const request = useCallback((next: () => void) => {
    if (blocker.current) setAction(() => next)
    else next()
  }, [])

  const register = useCallback((next: Blocker) => {
    blocker.current = next
    // Дублируем текущую запись с сохранением служебного состояния Next. Перехватываем
    // popstate до роутера, чтобы подтверждение появлялось до размонтирования формы.
    if (!window.history.state?.[TOP_KEY]) {
      const state = window.history.state
      window.history.replaceState({ ...state, [BASE_KEY]: true }, '', window.location.href)
      window.history.pushState({ ...state, [TOP_KEY]: true }, '', window.location.href)
    }
    return () => {
      if (blocker.current === next) blocker.current = null
    }
  }, [])

  useEffect(() => {
    function onPopState(event: PopStateEvent) {
      if (restoring.current) {
        restoring.current = false
        event.stopImmediatePropagation()
        return
      }
      if (skipping.current) {
        skipping.current = false
        return
      }
      if (!event.state?.[BASE_KEY]) {
        // После возврата на форму в истории может оставаться следующий маршрут.
        // Его открытие кнопкой «Вперёд» также требует подтверждения до ухода.
        if (!blocker.current) return
        event.stopImmediatePropagation()
        restoring.current = true
        window.history.back()
        request(() => {
          skipping.current = true
          window.history.forward()
        })
        return
      }
      event.stopImmediatePropagation()
      if (!blocker.current) {
        window.history.back()
        return
      }
      restoring.current = true
      window.history.forward()
      request(() => {
        skipping.current = true
        window.history.go(-2)
      })
    }
    window.addEventListener('popstate', onPopState, true)
    return () => window.removeEventListener('popstate', onPopState, true)
  }, [request])

  const cancel = useCallback(() => setAction(null), [])
  function confirm() {
    const next = action
    setAction(null)
    const current = blocker.current
    blocker.current = null
    current?.discard()
    next?.()
  }

  return (
    <GuardContext
      value={{
        register,
        request,
        navigate: (href) => request(() => router.push(href)),
        pending: action !== null,
        cancel,
        confirm,
      }}
    >
      {children}
    </GuardContext>
  )
}

export function useNavigationGuard() {
  return use(GuardContext)
}

export function useNavigationBlocker(active: boolean, onDiscard: () => void) {
  const guard = useNavigationGuard()
  const discard = useEffectEvent(onDiscard)
  const register = guard?.register
  useEffect(() => {
    if (!active || !register) return
    return register({ discard: () => discard() })
  }, [active, register])
}
