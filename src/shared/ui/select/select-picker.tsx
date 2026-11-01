'use client'

import { type CSSProperties, type KeyboardEvent, useEffect, useId, useRef, useState } from 'react'
import { cn } from '@/shared/lib/cn'
import { DialogShell } from '../dialog'
import { ChevronDownIcon, CheckIcon } from '../icons'
import type { SelectProps } from './select'
import styles from './select-picker.module.css'

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

  function close() {
    setOpen(false)
    trigger.current?.focus()
  }

  function show() {
    if (disabled) return
    setActive(
      Math.max(
        0,
        choices.findIndex((option) => option.value === value),
      ),
    )
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return
    function place() {
      const rect = trigger.current?.getBoundingClientRect()
      if (!rect) return
      setPosition({
        '--picker-left': `${rect.left}px`,
        '--picker-top': `${rect.bottom + 4}px`,
        '--picker-width': `${rect.width}px`,
        '--picker-height': `${Math.max(100, window.innerHeight - rect.bottom - 20)}px`,
      } as CSSProperties)
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
        onClick={show}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault()
            show()
          }
        }}
        onBlur={() => {
          if (!open) onControlBlur?.()
        }}
        className={cn(styles.trigger, error && styles.error)}
      >
        <span id={titleId} className={cn(styles.label, value && styles.filled)}>
          {label}
          {required ? '*' : ''}
        </span>
        {value && <span className={styles.value}>{selected?.label ?? value}</span>}
        <ChevronDownIcon aria-hidden className={cn(styles.chevron, open && styles.expanded)} />
      </button>
      <input type="hidden" name={name} value={value} disabled={disabled} />
      {error && (
        <p id={errorId} className={styles.message}>
          {error}
        </p>
      )}
      <DialogShell open={open} onClose={close} labelledBy={titleId} placement="bottom" className={styles.panel}>
        <div className={styles.position} style={position}>
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
                onPointerMove={() => setActive(index)}
                onClick={() => choose(index)}
              >
                {option.label}
                {option.value === value && <CheckIcon aria-hidden className={styles.check} />}
              </button>
            ))}
          </div>
        </div>
      </DialogShell>
    </div>
  )
}
