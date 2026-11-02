'use client'

import { useLayoutEffect, useRef } from 'react'
import { BREAKPOINTS_PX } from '@/shared/config'

const DURATION = 420
const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)'

/** Один управляемый перелёт поиска; повторный переход продолжает движение из текущего кадра. */
export function useSearchMotion(home: boolean) {
  const slotRef = useRef<HTMLDivElement>(null)
  const motionRef = useRef<HTMLDivElement>(null)
  const bounds = useRef<DOMRect | null>(null)
  const opacity = useRef(1)
  const animation = useRef<Animation | null>(null)
  const frame = useRef(0)

  useLayoutEffect(() => {
    const slot = slotRef.current
    const element = motionRef.current
    const header = slot?.closest<HTMLElement>('[data-layout-header]')
    if (!slot || !element || !header) return

    function place() {
      if (!slot || !element || !header) return
      const parent = header.getBoundingClientRect()
      const available = slot.getBoundingClientRect()
      const anchor = document.querySelector<HTMLElement>('[data-home-search-anchor]')?.getBoundingClientRect()
      // Центр экрана — только от --xl (см. BREAKPOINTS_PX и media.css); 700px — высота из макета главной.
      const expanded = window.matchMedia(`(min-width: ${BREAKPOINTS_PX.xl}px) and (min-height: 700px)`).matches
      const width = expanded ? Math.min(740, window.innerWidth - 80) : anchor?.width || available.width
      const left = expanded ? parent.left + parent.width / 2 - width / 2 : anchor?.width ? anchor.left : available.left
      const top = expanded
        ? available.top + Math.min(260, Math.max(120, window.innerHeight * 0.18))
        : anchor?.width
          ? anchor.top
          : available.top
      element.style.setProperty('--home-search-left', `${left - available.left}px`)
      element.style.setProperty('--home-search-top', `${top - available.top}px`)
      element.style.setProperty('--home-search-width', `${width}px`)
      element.style.setProperty('--home-search-height', `${expanded ? 74 : anchor?.height || 40}px`)
    }
    const previous = bounds.current
    const previousOpacity = opacity.current
    animation.current?.cancel()
    cancelAnimationFrame(frame.current)
    place()
    const target = element.getBoundingClientRect()
    const targetOpacity = Number(getComputedStyle(element).opacity)
    element.inert = targetOpacity === 0
    if (targetOpacity === 0) element.setAttribute('aria-hidden', 'true')
    else element.removeAttribute('aria-hidden')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (previous?.width && target.width && !reduced) {
      animation.current = element.animate(
        [
          {
            translate: `${previous.left - target.left}px ${previous.top - target.top}px`,
            width: `${previous.width}px`,
            height: `${previous.height}px`,
            opacity: previousOpacity,
          },
          { translate: '0px 0px', width: `${target.width}px`, height: `${target.height}px`, opacity: targetOpacity },
        ],
        { duration: DURATION, easing: EASING },
      )
      function sample() {
        bounds.current = element!.getBoundingClientRect()
        opacity.current = Number(getComputedStyle(element!).opacity)
        if (animation.current?.playState === 'running') frame.current = requestAnimationFrame(sample)
      }
      frame.current = requestAnimationFrame(sample)
    }
    bounds.current = target
    opacity.current = targetOpacity

    // Пересчёт при ресайзе и загрузке шрифта, без перелёта через брейкпоинт.
    function resize() {
      animation.current?.cancel()
      cancelAnimationFrame(frame.current)
      place()
      bounds.current = element!.getBoundingClientRect()
      opacity.current = Number(getComputedStyle(element!).opacity)
      element!.inert = opacity.current === 0
      if (opacity.current === 0) element!.setAttribute('aria-hidden', 'true')
      else element!.removeAttribute('aria-hidden')
    }
    let initialObservation = true
    const observer = new ResizeObserver(() => {
      if (initialObservation) {
        initialObservation = false
        return
      }
      resize()
    })
    observer.observe(slot)
    const anchor = document.querySelector<HTMLElement>('[data-home-search-anchor]')
    if (anchor) observer.observe(anchor)
    window.addEventListener('resize', resize)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [home])

  useLayoutEffect(
    () => () => {
      animation.current?.cancel()
      cancelAnimationFrame(frame.current)
    },
    [],
  )

  return { slotRef, motionRef }
}
