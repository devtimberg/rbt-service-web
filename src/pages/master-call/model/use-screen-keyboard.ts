'use client'

import { useEffect, useState } from 'react'

/** Экранная клавиатура уменьшает visualViewport; один фокус поля не скрывает кнопку. */
export function useScreenKeyboard() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return
    let fullHeight = Math.max(window.innerHeight, viewport.height)
    let frame = 0
    function update() {
      if (!viewport) return
      const editing =
        document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement
      if (!editing) fullHeight = Math.max(fullHeight, window.innerHeight, viewport.height)
      const shown = editing && viewport.scale === 1 && fullHeight - viewport.height > 120
      setOpen(shown)
      if (shown) {
        cancelAnimationFrame(frame)
        frame = requestAnimationFrame(() =>
          document.activeElement?.scrollIntoView({ block: 'nearest', behavior: 'instant' }),
        )
      }
    }
    function rotate() {
      fullHeight = window.innerHeight
      update()
    }
    viewport.addEventListener('resize', update)
    document.addEventListener('focusin', update)
    document.addEventListener('focusout', update)
    window.addEventListener('orientationchange', rotate)
    return () => {
      cancelAnimationFrame(frame)
      viewport.removeEventListener('resize', update)
      document.removeEventListener('focusin', update)
      document.removeEventListener('focusout', update)
      window.removeEventListener('orientationchange', rotate)
    }
  }, [])
  return open
}
