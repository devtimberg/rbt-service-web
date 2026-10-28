import type { ComponentType, SVGProps } from 'react'
import { useCartStore } from '@/entities/cart'
import { useFavoritesStore } from '@/entities/favorite'
import { HOME_NAV_PATHS, ROUTES } from '@/shared/config'
import { usePathname } from '@/shared/lib/usePathname'
import { Box } from '@/shared/ui/Box'
import { IconButton } from '@/shared/ui/IconButton'
import { BagIcon, CatalogIcon, HeartIcon, HomeIcon } from '@/shared/ui/icons'
import { List, ListItem } from '@/shared/ui/List'
import styles from './MobileBottomNav.module.css'

const HIDDEN_NAV_ROUTES: Set<string> = new Set([ROUTES.MASTER_CALL, ROUTES.SEARCH])

type NavItem = {
  label: string
  href: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  counter?: number | undefined
  additionalActivePaths?: string[]
}

export function MobileBottomNav() {
  const pathname = usePathname()
  const cartCount = useCartStore((s) => s.items.size)
  const favoritesCount = useFavoritesStore((s) => s.items.size)

  const navItems: NavItem[] = [
    {
      label: 'Главная',
      href: ROUTES.HOME,
      icon: HomeIcon,
      additionalActivePaths: HOME_NAV_PATHS.filter((p) => p !== ROUTES.HOME),
    },
    {
      label: 'Каталог',
      href: ROUTES.CATALOG,
      icon: CatalogIcon,
    },
    {
      label: 'Избранное',
      href: ROUTES.FAVORITE,
      icon: HeartIcon,
      counter: favoritesCount || undefined,
    },
    {
      label: 'Корзина',
      href: ROUTES.CART,
      icon: BagIcon,
      counter: cartCount || undefined,
    },
  ]

  if (HIDDEN_NAV_ROUTES.has(pathname)) return null

  return (
    <Box as="nav" className={styles.root} aria-label="Мобильная навигация">
      <List className={styles.list}>
        {navItems.map((item) => (
          <ListItem key={item.href} className={styles.item}>
            <IconButton
              href={item.href}
              variant="ghost"
              size="lg"
              icon={item.icon}
              iconSize={32}
              counter={item.counter ?? null}
              className={styles.button}
              activeClassName={styles.active}
              matchPath="prefix"
              {...(item.additionalActivePaths ? { additionalActivePaths: item.additionalActivePaths } : {})}
              disableHover
              aria-label={item.label}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
