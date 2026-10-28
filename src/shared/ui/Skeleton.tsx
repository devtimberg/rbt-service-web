import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/cn'
import styles from './Skeleton.module.css'

/** Заглушка на время загрузки. */
export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return <div aria-hidden className={cn(styles.root, className)} {...props} />
}
