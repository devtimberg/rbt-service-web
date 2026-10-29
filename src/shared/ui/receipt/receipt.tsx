import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import styles from './receipt.module.css'

export type ReceiptProps = ComponentProps<'div'> & {
  /** Рваный край: только сверху (по умолчанию) или и сверху, и снизу. */
  torn?: 'top' | 'both'
}

/** Бумага чека: белый фон, моно-шрифт, зубцы краёв маской. Содержимое — любые дети. */
export function Receipt({ torn = 'top', className, ...props }: ReceiptProps) {
  return <div className={cn(styles.root, torn === 'both' && styles.both, className)} {...props} />
}

export type ReceiptTextProps = ComponentProps<'p'> & {
  /** title 18.4px bold (шапка, номер), row 16px, note 14.8px (дата, сноска), consent 12px, legal 10px (реквизиты). */
  size?: 'title' | 'row' | 'note' | 'consent' | 'legal'
}

/** Абзац внутри чека с размером шрифта из макета. */
export function ReceiptText({ size = 'row', className, ...props }: ReceiptTextProps) {
  return <p className={cn(styles.text, styles[size], className)} {...props} />
}

export type ReceiptRowProps = Omit<ComponentProps<'div'>, 'children'> & {
  label: ReactNode
  /** Пусто (undefined, null, '') — рисуется `placeholder`. */
  value?: ReactNode
  /** Заглушка пустого значения, по умолчанию `______`. */
  placeholder?: string
  /** Значение переносится под подпись, без точек. */
  multiline?: boolean
}

/** Строка «подпись ....... значение». */
export function ReceiptRow({ label, value, placeholder = '______', multiline, className, ...props }: ReceiptRowProps) {
  const empty = value === undefined || value === null || value === ''
  return (
    <div className={cn(styles.line, multiline && styles.multiline, className)} {...props}>
      <span>{label}</span>
      {!multiline && <span className={styles.dots} aria-hidden="true" />}
      <span className={styles.value}>{empty ? placeholder : value}</span>
    </div>
  )
}

/** Пунктирный разделитель. */
export function ReceiptRule({ className, ...props }: ComponentProps<'hr'>) {
  return <hr className={cn(styles.rule, className)} {...props} />
}
