'use client'

import { useRouter } from 'next/navigation'
import { type ReactNode, useRef, useState } from 'react'
import { useCartStore } from '@/entities/cart'
import { useFavoritesStore } from '@/entities/favorite'
import { isLockedSection, LockedSectionDialog } from '@/features/locked-section'
import { useSearchStore } from '@/features/search-products'
import { ROUTES } from '@/shared/config'
import { cn } from '@/shared/lib/cn'
import { useNavigationGuard } from '@/shared/lib/navigation-guard'
import { usePathname } from '@/shared/lib/use-pathname'
import {
  BagIcon,
  Box,
  Stack,
  Button,
  CatalogIcon,
  Container,
  HeartIcon,
  IconButton,
  ClearIcon,
  CloseIcon,
  CrossIcon,
  FilterIcon,
  ProfileIcon,
  SearchIcon,
  SearchOutlineIcon,
  Image,
  SmartLink,
  Text,
  TextInput,
} from '@/shared/ui'
import { getRouteTitle } from '../lib/get-route-title'
import { useSearchMotion } from '../lib/use-search-motion'
import styles from './header.module.css'

const CLOSE_BUTTON_ROUTES: Set<string> = new Set([ROUTES.MASTER_CALL])

type HeaderProps = {
  /** Поиск по каталогу для десктопа. Виджет не импортирует другой виджет, поэтому его передаёт app. */
  search: ReactNode
  /** Блок под поиском на главной, когда поиск уезжает в центр экрана (плашка MVP). Передаёт app. */
  homeNotice?: ReactNode
  /** Тайминг домашнего положения поиска при закрытии шторки; действует только на главной. Передаёт app. */
  homeSearch?: boolean
}

export function Header({ search, homeNotice, homeSearch }: HeaderProps) {
  const [lockedOpen, setLockedOpen] = useState(false)
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
  const guard = useNavigationGuard()
  const isHomePage = pathname === ROUTES.HOME
  // Домашнее положение поиска — только на главной (ADR 0015): homeSearch согласует лишь тайминг
  // возврата при закрытии шторки, сам по себе он истинен для любого нешторочного маршрута.
  const searchAtHome = isHomePage && (homeSearch ?? true)
  const { slotRef, motionRef } = useSearchMotion(searchAtHome)
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
        {/* Мобильный поиск на странице поиска */}
        {isSearch && (
          <Box className={styles.mobileSearch}>
            <Box className={styles.searchField}>
              <SearchOutlineIcon className={styles.searchIcon} aria-hidden />
              {isLockedSection(ROUTES.SEARCH) ? (
                <Button
                  variant="unstyled"
                  className={styles.lockedSearchInput}
                  aria-label="Поиск запчастей"
                  aria-haspopup="dialog"
                  onClick={() => setLockedOpen(true)}
                >
                  Поиск запчастей
                </Button>
              ) : (
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
              )}
              {!isLockedSection(ROUTES.SEARCH) && searchQuery.length > 0 && (
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

        {/* Мобильная шапка: логотип на главной, заголовок на остальных страницах */}
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

        {/* Закрытие формы вызова мастера */}
        {showCloseButton && (
          <Button
            variant="unstyled"
            type="button"
            onClick={() => {
              // Закрытие мастера вызова: возврат на главную, шторка закроется по смене маршрута
              if (guard) guard.request(() => router.push(ROUTES.HOME))
              else router.push(ROUTES.HOME)
            }}
            className={styles.closeButton}
            aria-label="Закрыть"
          >
            <CrossIcon width={24} height={24} />
          </Button>
        )}

        {/* Поиск в каталоге и фильтры в подразделе */}
        {!isSearch && isCatalog && (
          <Stack direction="row" gap={6} className={styles.catalogActions}>
            <IconButton
              variant="inverse"
              size="sm"
              icon={SearchIcon}
              iconSize={28}
              aria-label="Поиск запчастей"
              {...(isLockedSection(ROUTES.SEARCH)
                ? { type: 'button' as const, 'aria-haspopup': 'dialog' as const, onClick: () => setLockedOpen(true) }
                : { href: ROUTES.SEARCH })}
            />
            {isCatalogSubpage && (
              <IconButton variant="inverse" size="sm" icon={FilterIcon} iconSize={28} aria-label="Фильтры" />
            )}
          </Stack>
        )}

        {/* Логотип на десктопе */}
        <SmartLink href={ROUTES.HOME} className={styles.desktopLogo}>
          <Image
            src="/brand/logo.svg"
            alt="ООО ТТЦ Рембыттехника"
            width={211}
            height={32}
            className={styles.desktopLogoImage}
          />
        </SmartLink>

        <Box className={styles.catalogSlot}>
          <Button
            {...(isLockedSection(ROUTES.CATALOG)
              ? { type: 'button' as const, 'aria-haspopup': 'dialog' as const, onClick: () => setLockedOpen(true) }
              : { href: ROUTES.CATALOG })}
            variant="primary"
            icon={<CatalogIcon width={24} height={24} />}
            className={cn(styles.catalogButton, searchAtHome && styles.catalogButtonHidden)}
            tabIndex={searchAtHome ? -1 : undefined}
            aria-hidden={searchAtHome || undefined}
          >
            Каталог
          </Button>
        </Box>

        {/* Десктоп: поиск на главной перемещается в центр экрана. */}
        <Box ref={slotRef} className={cn(styles.desktopSearch, searchAtHome && styles.desktopSearchHome)}>
          <Box ref={motionRef} data-home={searchAtHome ? '' : undefined} className={styles.searchMotion}>
            {search}
            {homeNotice ? (
              <Box className={cn(styles.homeNotice, !searchAtHome && styles.homeNoticeHidden)}>{homeNotice}</Box>
            ) : null}
          </Box>
        </Box>

        {/* Навигация на десктопе */}
        <Stack direction="row" className={styles.desktopIcons}>
          {desktopIcons.map(({ id, icon, href, ariaLabel, counter }) => (
            <IconButton
              key={id}
              size="lg"
              icon={icon}
              iconSize={32}
              counter={counter ?? null}
              tooltip={ariaLabel}
              className={styles.headerIcon}
              activeClassName={styles.headerIconActive}
              aria-label={ariaLabel}
              // Закрытый раздел: вместо перехода окно «Этот раздел ещё в работе»
              {...(isLockedSection(href)
                ? { type: 'button' as const, 'aria-haspopup': 'dialog' as const, onClick: () => setLockedOpen(true) }
                : { href })}
            />
          ))}
          {/* Профиля в MVP нет (ADR 0010): окно «Этот раздел ещё в работе» */}
          <IconButton
            size="lg"
            icon={ProfileIcon}
            iconSize={32}
            tooltip="Профиль"
            className={styles.headerIcon}
            aria-label="Профиль"
            aria-haspopup="dialog"
            type="button"
            onClick={() => setLockedOpen(true)}
          />
        </Stack>
      </Container>
      <LockedSectionDialog open={lockedOpen} onClose={() => setLockedOpen(false)} />
    </>
  )
}
