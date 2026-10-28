import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/cn'
import { Input } from '../input'
import styles from './text-input.module.css'

/** Стилизованное текстовое поле без подписи. Невалидное состояние включается атрибутом aria-invalid. */
export function TextInput({ className, type, ...props }: ComponentProps<'input'>) {
  return <Input type={type} className={cn(styles.root, className)} {...props} />
}
