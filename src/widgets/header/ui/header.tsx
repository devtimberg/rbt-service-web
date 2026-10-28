'use client'

import { useRouter } from 'next/navigation'
import { type ReactNode, useRef } from 'react'
import { useCartStore } from '@/entities/cart'
import { useFavoritesStore } from '@/entities/favorite'
import { useSearchStore } from '@/features/search-products'
import { ROUTES } from '@/shared/config'
import { cn } from '@/shared/lib/cn'
import { usePathname } from '@/shared/lib/use-pathname'
import {
  Box,
  Stack,
  Button,
  Container,
  IconButton,
  BagIcon,
  ClearIcon,
  CloseIcon,
  CrossIcon,
  FilterIcon,
  HeartIcon,
  ProfileIcon,
  SearchIcon,
  SearchOutlineIcon,
  Image,
  SmartLink,
  Text,
  TextInput,
} from '@/shared/ui'
import { getRouteTitle } from '../lib/get-route-title'
import styles from './header.module.css'

const CLOSE_BUTTON_ROUTES: Set<string> = new Set([ROUTES.MASTER_CALL])

type HeaderProps = {
  /** Поиск по каталогу для десктопа. Виджет не импортирует другой виджет, поэтому его передаёт app. */
  search: ReactNode
}

export function Header({ search }: HeaderProps) {
  const pathname = usePathname()
  const cartCount = useCartStore((s) => s.items.size)
  const favoritesCount = useFavoritesStore((s) => s.items.size)

  const desktopIcons = [
    {
      id: 'favorite',
      icon: HeartIcon,
      href: ROUTES.FAVORITE,
      ariaLabel: 'Избранное',
      counter: favoritesCount || undefined,
    },
    {
      id: 'cart',
      icon: BagIcon,
      href: ROUTES.CART,
      ariaLabel: 'Корзина',
      counter: cartCount || undefined,
    },
  ]
  const router = useRouter()
  const isHomePage = pathname === ROUTES.HOME
  const isCart = pathname === ROUTES.CART
  const isCatalog = pathname.startsWith(ROUTES.CATALOG)
  const isCatalogSubpage = isCatalog && pathname !== ROUTES.CATALOG
  const isSearch = pathname === ROUTES.SEARCH
  const showCloseButton = CLOSE_BUTTON_ROUTES.has(pathname)
  const pageTitle = getRouteTitle(pathname)
  const searchQuery = useSearchStore((s) => s.query)
  const setSearchQuery = useSearchStore((s) => s.setQuery)
  const resetSearch = useSearchStore((s) => s.reset)
  const searchInputRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <Box aria-hidden className={styles.spacer} />
      <Container data-layout-header="true" className={styles.root}>
        {/* Mobile: search input on /search */}
        {isSearch && (
          <Box className={styles.mobileSearch}>
            <Box className={styles.searchField}>
              <SearchOutlineIcon className={styles.searchIcon} aria-hidden />
              <TextInput
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                // Страница поиска на мобильном: поле сразу готово к вводу
                // oxlint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                className={styles.searchInput}
                placeholder="Поиск запчастей"
                autoComplete="off"
              />
              {searchQuery.length > 0 && (
                <IconButton
                  icon={ClearIcon}
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    resetSearch()
                    searchInputRef.current?.focus()
                  }}
                  aria-label="Очистить"
                  className={styles.clearButton}
                />
              )}
            </Box>
            <IconButton
              icon={CloseIcon}
              size="sm"
              variant="ghost"
              onClick={() => {
                resetSearch()
                router.back()
              }}
              aria-label="Закрыть поиск"
              className={styles.closeSearchButton}
            />
          </Box>
        )}

        {/* Mobile: logo on home, title on other pages */}
        {!isSearch && isHomePage && (
          <SmartLink href={ROUTES.HOME} className={styles.mobileLogo}>
            <Image
              src="/brand/logo.svg"
              alt="ООО ТТЦ Рембыттехника"
              width={180}
              height={40}
              fetchPriority="high"
              className={styles.logo}
            />
          </SmartLink>
        )}
        {!isSearch && !isHomePage && (
          <Box className={styles.mobileTitle}>
            <Text className={styles.title}>{isCatalog ? 'Каталог' : pageTitle}</Text>
            {isCart && cartCount > 0 && (
              <Text as="span" className={styles.cartBadge}>
                {cartCount}
              </Text>
            )}
          </Box>
        )}

        {/* Mobile: close button for wizard flows */}
        {showCloseButton && (
          <Button
            variant="unstyled"
            type="button"
            onClick={() => {
              // Закрытие мастера вызова: возврат на главную, шторка закроется по смене маршрута
              router.push(ROUTES.HOME)
            }}
            className={styles.closeButton}
            aria-label="Закрыть"
          >
            <CrossIcon width={24} height={24} />
          </Button>
        )}

        {/* Mobile: search on catalog, search + filter on subcategory */}
        {!isSearch && isCatalog && (
          <Stack direction="row" gap={6} className={styles.catalogActions}>
            <IconButton
              variant="inverse"
              size="sm"
              icon={SearchIcon}
              iconSize={28}
              aria-label="Поиск запчастей"
              href={ROUTES.SEARCH}
            />
            {isCatalogSubpage && (
              <IconButton variant="inverse" size="sm" icon={FilterIcon} iconSize={28} aria-label="Фильтры" />
            )}
          </Stack>
        )}

        {/* Desktop: logo */}
        <SmartLink href={ROUTES.HOME} className={styles.desktopLogo}>
          <Image src="/brand/logo.svg" alt="ООО ТТЦ Рембыттехника" width={180} height={40} className={styles.logo} />
        </SmartLink>

        {/* Desktop: search — one element, CSS-driven expanded/compact */}
        <Box
          data-home={isHomePage ? '' : undefined}
          className={cn(styles.desktopSearch, isHomePage && styles.desktopSearchHome)}
        >
          {search}
        </Box>

        {/* Desktop: icons */}
        <Stack direction="row" className={styles.desktopIcons} gap={10}>
          {desktopIcons.map(({ id, icon, href, ariaLabel, counter }) => (
            <IconButton
              key={id}
              size="lg"
              icon={icon}
              iconSize={28}
              counter={counter ?? null}
              tooltip={ariaLabel}
              className={styles.headerIcon}
              activeClassName={styles.headerIconActive}
              aria-label={ariaLabel}
              href={href}
            />
          ))}
          {/* По клику будет общая подсказка «скоро заработает» (отдельная задача) */}
          <IconButton
            size="lg"
            icon={ProfileIcon}
            iconSize={28}
            tooltip="Профиль"
            className={styles.headerIcon}
            aria-label="Профиль"
            type="button"
          />
        </Stack>
      </Container>
    </>
  )
}
