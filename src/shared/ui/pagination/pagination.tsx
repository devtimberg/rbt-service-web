import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/cn'
import { type ButtonSize, buttonClass } from '../button'
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from '../icons'
import styles from './pagination.module.css'

export function Pagination({ className, ...props }: ComponentProps<'nav'>) {
  return (
    <nav
      aria-label="Постраничная навигация"

      className={cn(styles.root, className)}
      {...props}
    />
  )
}

export function PaginationContent({ className, ...props }: ComponentProps<'ul'>) {
  return <ul className={cn(styles.content, className)} {...props} />
}

export function PaginationItem(props: ComponentProps<'li'>) {
  return <li {...props} />
}

type PaginationLinkProps = ComponentProps<'a'> & {
  isActive?: boolean
  size?: ButtonSize
}

export function PaginationLink({ className, isActive, size = 'icon', ...props }: PaginationLinkProps) {
  return (
    // Содержимое приходит через props.children
    // oxlint-disable-next-line jsx-a11y/anchor-has-content
    <a
      aria-current={isActive ? 'page' : undefined}

      data-active={isActive}
      className={cn(buttonClass({ variant: isActive ? 'secondary' : 'ghost', size }), styles.link, className)}
      {...props}
    />
  )
}

export function PaginationPrevious({ className, ...props }: ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Предыдущая страница" size="sm" className={cn(styles.withGap, className)} {...props}>
      <ChevronLeftIcon className={styles.icon} />
      <span>Назад</span>
    </PaginationLink>
  )
}

export function PaginationNext({ className, ...props }: ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Следующая страница" size="sm" className={cn(styles.withGap, className)} {...props}>
      <span>Вперёд</span>
      <ChevronRightIcon className={styles.icon} />
    </PaginationLink>
  )
}

export function PaginationEllipsis({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      aria-hidden

      className={cn(styles.ellipsis, className)}
      {...props}
    >
      <MoreHorizontalIcon className={styles.icon} />
    </span>
  )
}
