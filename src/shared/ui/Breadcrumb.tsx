import { cn } from '@/shared/lib/cn'
import { HomeIcon } from './icons'
import { SmartLink } from './SmartLink'
import styles from './Breadcrumb.module.css'

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
    <nav aria-label="Breadcrumb" className={cn('scrollbar-none', styles.root, className)}>
      <SmartLink href={homeHref} aria-label="Главная" className={styles.link}>
        <HomeIcon className={styles.homeIcon} />
      </SmartLink>

      {items.map((item, index) => (
        <span key={`${index}-${item.label}`} className={styles.item}>
          <span aria-hidden>—</span>
          {item.href ? (
            <SmartLink href={item.href} className={styles.link}>
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
