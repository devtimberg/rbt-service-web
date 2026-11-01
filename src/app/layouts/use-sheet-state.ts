'use client'

import { useEffect, useState } from 'react'

/** Длительность закрытия: совпадает с --sheet-close-duration в sheet-layout.module.css. */
export const SHEET_CLOSE_DURATION_MS = 340

export type SheetState = {
  /** Шторка смонтирована (открыта или закрывается). */
  rendered: boolean
  /** Шторка в открытом положении (data-state="open"). */
  open: boolean
  /** Первый показ без анимации: заход по прямой ссылке на страницу-шторку. */
  disableOpenAnimation: boolean
  /** Домашнее положение поиска: при закрытии поиск следует за уходящей панелью. */
  homeSearch: boolean
}

/**
 * Жизненный цикл шторки по признаку маршрута.
 * Начальное состояние берётся из совпавшего маршрута, а не из window, поэтому SSR и гидрация совпадают:
 * при заходе на страницу-шторку она сразу открыта и без анимации.
 * Переход на шторку: монтируется закрытой, в следующих кадрах открывается (CSS-анимация с задержкой для поиска).
 * Уход на главную: закрывается, через 340 мс размонтируется.
 */
export function useSheetState(isSheet: boolean): SheetState {
  const [rendered, setRendered] = useState(isSheet)
  const [open, setOpen] = useState(isSheet)
  const [disableOpenAnimation, setDisableOpenAnimation] = useState(isSheet)

  const [homeSearch, setHomeSearch] = useState(!isSheet)

  // Синхронизация во время рендера (вместо setState в эффекте)
  if (isSheet && !rendered) setRendered(true)
  if (isSheet && homeSearch) setHomeSearch(false)

  // После первого кадра включаем анимации, чтобы шторка, открытая при загрузке, закрывалась плавно
  useEffect(() => {
    if (!disableOpenAnimation) return
    const frame = requestAnimationFrame(() => setDisableOpenAnimation(false))
    return () => cancelAnimationFrame(frame)
  }, [disableOpenAnimation])

  // Открытие: шторка должна успеть отрисоваться закрытой, иначе анимации не будет
  useEffect(() => {
    if (!isSheet || open) return
    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setOpen(true))
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [isSheet, open])

  // Закрытие: сначала анимация, потом размонтирование
  useEffect(() => {
    if (isSheet || !rendered) return
    const frame = requestAnimationFrame(() => setOpen(false))
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const timer = setTimeout(() => setRendered(false), reduced ? 0 : SHEET_CLOSE_DURATION_MS)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(timer)
    }
  }, [isSheet, rendered])

  useEffect(() => {
    if (isSheet) return
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const timer = setTimeout(() => setHomeSearch(true), reduced ? 0 : 80)
    return () => clearTimeout(timer)
  }, [isSheet])

  return { rendered, open, disableOpenAnimation, homeSearch }
}
