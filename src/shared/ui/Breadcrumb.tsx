import { cn } from '@/shared/lib/cn'
import { HomeIcon } from './icons'
import { SmartLink } from './SmartLink'

export type BreadcrumbItem = {
  label: string
  href?: string
}

type BreadcrumbProps = {
  items: BreadcrumbItem[]
  /** Адрес иконки «домой» в начале цепочки. */
  homeHref?: string
  className?: string
}

export function Breadcrumb({ items, homeHref = '/', className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        'scrollbar-none -mx-4 flex items-center gap-1.5 overflow-x-auto px-4 text-sm whitespace-nowrap text-primary-100',
        className,
      )}
    >
      <SmartLink href={homeHref} aria-label="Главная" className="hover:text-primary-500">
        <HomeIcon className="size-4" />
      </SmartLink>

      {items.map((item, index) => (
        <span key={`${index}-${item.label}`} className="flex shrink-0 items-center gap-1.5">
          <span aria-hidden>—</span>
          {item.href ? (
            <SmartLink href={item.href} className="hover:text-primary-500">
              {item.label}
            </SmartLink>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
