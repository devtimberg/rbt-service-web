import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/cn'
import { type ButtonSize, buttonClass } from './Button'
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from './icons'

export function Pagination({ className, ...props }: ComponentProps<'nav'>) {
  return (
    <nav
      aria-label="Постраничная навигация"
      data-slot="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  )
}

export function PaginationContent({ className, ...props }: ComponentProps<'ul'>) {
  return <ul data-slot="pagination-content" className={cn('flex flex-row items-center gap-1', className)} {...props} />
}

export function PaginationItem(props: ComponentProps<'li'>) {
  return <li data-slot="pagination-item" {...props} />
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
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonClass({ variant: isActive ? 'secondary' : 'ghost', size }),
        'hover:bg-transparent hover:text-current',
        className,
      )}
      {...props}
    />
  )
}

export function PaginationPrevious({ className, ...props }: ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Предыдущая страница" size="sm" className={cn('gap-1', className)} {...props}>
      <ChevronLeftIcon className="size-4" />
      <span>Назад</span>
    </PaginationLink>
  )
}

export function PaginationNext({ className, ...props }: ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Следующая страница" size="sm" className={cn('gap-1', className)} {...props}>
      <span>Вперёд</span>
      <ChevronRightIcon className="size-4" />
    </PaginationLink>
  )
}

export function PaginationEllipsis({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn('flex size-9 items-center justify-center', className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
    </span>
  )
}
