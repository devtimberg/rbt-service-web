'use client'

import { type CSSProperties, type KeyboardEvent, useEffect, useEffectEvent, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/shared/lib/cn'
import { useIsMobile } from '@/shared/lib/use-media-query'
import { DialogShell } from '../dialog'
import { ChevronDownIcon } from '../icons'
import type { SelectProps } from './select'
import styles from './select-picker.module.css'

function pickerPosition(trigger: HTMLElement | null): CSSProperties {
  if (!trigger) return {}
  const rect = trigger.getBoundingClientRect()
  return {
    '--picker-left': `${rect.left}px`,
    '--picker-top': `${rect.bottom + 4}px`,
    '--picker-width': `${rect.width}px`,
    '--picker-height': `${Math.max(100, window.innerHeight - rect.bottom - 20)}px`,
  } as CSSProperties
}

/** Выбор в верхнем слое браузера: список не обрезается прокручиваемой страницей. */
export function SelectPicker({
  id,
  label,
  name,
  value,
  options,
  error,
  required,
  disabled,
  className,
  onValueChange,
  onControlBlur,
  controlRef,
}: SelectProps) {
  const isMobile = useIsMobile()
  const generatedId = useId()
  const controlId = id ?? generatedId
  const titleId = `${controlId}-label`
  const listId = `${controlId}-list`
  const errorId = `${controlId}-error`
  const trigger = useRef<HTMLButtonElement>(null)
  const list = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<CSSProperties>({})
  const [active, setActive] = useState(0)
  const choices = [{ value: '', label: 'Не выбрано' }, ...options]
  const selected = choices.find((option) => option.value === value)
  const search = useRef({ value: '', time: 0 })

  function close(restoreFocus = true) {
    setOpen(false)
    if (restoreFocus) trigger.current?.focus()
  }

  const dismissOutside = useEffectEvent(() => close(false))
  const dismissKeyboard = useEffectEvent(() => close())

  function show() {
    if (disabled) return
    setActive(
      Math.max(
        0,
        choices.findIndex((option) => option.value === value),
      ),
    )
    setPosition(pickerPosition(trigger.current))
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return
    function place() {
      setPosition(pickerPosition(trigger.current))
    }
    place()
    const frame = requestAnimationFrame(() =>
      list.current?.querySelector<HTMLButtonElement>('button[tabindex="0"]')?.focus(),
    )
    window.addEventListener('resize', place)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', place)
    }
  }, [open])

  useEffect(() => {
    if (!open || isMobile) return
    function outside(event: PointerEvent | FocusEvent) {
      if (!(event.target instanceof Node)) return
      if (!trigger.current?.contains(event.target) && !list.current?.parentElement?.contains(event.target))
        dismissOutside()
    }
    function scrollOutside(event: Event) {
      if (!(event.target instanceof Node) || !list.current?.contains(event.target)) dismissOutside()
    }
    function escape(event: globalThis.KeyboardEvent) {
      if (event.key !== 'Escape') return
      event.preventDefault()
      dismissKeyboard()
    }
    document.addEventListener('pointerdown', outside, true)
    document.addEventListener('focusin', outside)
    document.addEventListener('keydown', escape)
    document.addEventListener('scroll', scrollOutside, true)
    return () => {
      document.removeEventListener('pointerdown', outside, true)
      document.removeEventListener('focusin', outside)
      document.removeEventListener('keydown', escape)
      document.removeEventListener('scroll', scrollOutside, true)
    }
  }, [open, isMobile])

  useEffect(() => {
    if (open) {
      const option = document.getElementById(`${listId}-${active}`)
      option?.scrollIntoView?.({ block: 'nearest' })
      option?.focus({ preventScroll: true })
    }
  }, [active, open, listId])

  function choose(index: number) {
    const option = choices[index]
    if (option) onValueChange?.(option.value)
    close()
  }

  function handleKeys(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Tab') {
      // Возвращаем точку табуляции к полю и даём браузеру перейти дальше по форме.
      close()
      return
    }
    let next = active
    if (event.key === 'ArrowDown') next = (active + 1) % choices.length
    else if (event.key === 'ArrowUp') next = (active - 1 + choices.length) % choices.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = choices.length - 1
    else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      choose(active)
      return
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const now = event.timeStamp
      search.current = {
        value: (now - search.current.time < 700 ? search.current.value : '') + event.key.toLocaleLowerCase('ru'),
        time: now,
      }
      const found = choices.findIndex((option) => option.label.toLocaleLowerCase('ru').startsWith(search.current.value))
      if (found >= 0) next = found
    } else return
    event.preventDefault()
    setActive(next)
  }

  return (
    <div className={cn(styles.root, className)}>
      <button
        id={controlId}
        type="button"
        ref={(node) => {
          trigger.current = node
          controlRef?.(node)
        }}
        disabled={disabled}
        aria-labelledby={titleId}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-describedby={error ? errorId : undefined}
        // Триггер select-подобного поля: скринридеры объявляют ошибку и на кнопке, хотя ARIA-роль button
        // атрибут не описывает — поэтому точечное исключение из правила.
        // oxlint-disable-next-line jsx-a11y/role-supports-aria-props
        aria-invalid={error ? true : undefined}
        onClick={() => {
          if (open) close()
          else show()
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault()
            show()
          }
        }}
        onBlur={() => {
          if (!open) onControlBlur?.()
        }}
        className={cn(styles.trigger, open && styles.open, error && styles.error)}
      >
        <span id={titleId} className={cn(styles.label, (value || open) && styles.filled)}>
          {label}
          {required ? '*' : ''}
        </span>
        {(value || open) && <span className={styles.value}>{selected?.label ?? value}</span>}
        <ChevronDownIcon aria-hidden className={cn(styles.chevron, open && styles.expanded)} />
      </button>
      <input type="hidden" name={name} value={value} disabled={disabled} />
      {error && (
        <p id={errorId} className={styles.message}>
          {error}
        </p>
      )}
      {open &&
        createPortal(
          <DialogShell
            key={isMobile ? 'mobile' : 'desktop'}
            open={open}
            modal={isMobile}
            onClose={() => close(false)}
            labelledBy={titleId}
            placement="bottom"
            className={styles.panel}
            style={isMobile ? undefined : position}
          >
            <div className={styles.position}>
              <div className={styles.handle} aria-hidden />
              <h2 className={styles.title}>{label}</h2>
              <div ref={list} id={listId} aria-labelledby={titleId} className={styles.options}>
                {choices.map((option, index) => (
                  <button
                    type="button"
                    key={option.value}
                    id={`${listId}-${index}`}
                    aria-pressed={option.value === value}
                    tabIndex={index === active ? 0 : -1}
                    onKeyDown={handleKeys}
                    className={cn(styles.option, index === active && styles.active)}
                    onPointerMove={(event) => {
                      if (event.pointerType === 'mouse') setActive(index)
                    }}
                    onClick={() => choose(index)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </DialogShell>,
          document.body,
        )}
    </div>
  )
}
