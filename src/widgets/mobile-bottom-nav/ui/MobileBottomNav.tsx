import type { ComponentType, SVGProps } from 'react'
import { useCartStore } from '@/entities/cart'
import { useFavoritesStore } from '@/entities/favorite'
import { HOME_NAV_PATHS, ROUTES } from '@/shared/config'
import { usePathname } from '@/shared/lib/usePathname'
import { Box } from '@/shared/ui/Box'
import { IconButton } from '@/shared/ui/IconButton'
import { BagIcon, CatalogIcon, HeartIcon, HomeIcon, ProfileIcon } from '@/shared/ui/icons'
import { List, ListItem } from '@/shared/ui/List'

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
    {
      label: 'Профиль',
      href: ROUTES.PROFILE,
      icon: ProfileIcon,
    },
  ]

  if (HIDDEN_NAV_ROUTES.has(pathname)) return null

  return (
    <Box
      as="nav"
      className="shadow-primary-900/15 fixed inset-x-0 bottom-0 z-40
        rounded-t-[24px] bg-[#F7FAFF] px-2 pt-2
        pb-[max(env(safe-area-inset-bottom),8px)] shadow-[0_-0px_60px_-0px]
        sm:hidden"
      aria-label="Мобильная навигация"
    >
      <List className="grid grid-cols-5 gap-0.5">
        {navItems.map((item) => (
          <ListItem key={item.href} className="flex min-h-13 items-center justify-center">
            <IconButton
              href={item.href}
              variant="ghost"
              size="lg"
              icon={item.icon}
              iconSize={32}
              counter={item.counter ?? null}
              className="text-primary-100 rounded-xl"
              activeClassName="text-primary-500"
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
