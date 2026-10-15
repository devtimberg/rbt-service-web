import { useRouter } from '@tanstack/react-router'
import { type ReactNode, useRef } from 'react'
import { useCartStore } from '@/entities/cart'
import { useFavoritesStore } from '@/entities/favorite'
import { useSearchStore } from '@/features/search-products'
import { ROUTES } from '@/shared/config'
import { cn } from '@/shared/lib/cn'
import { usePathname } from '@/shared/lib/usePathname'
import { Container } from '@/shared/ui/Container'
import { HStack } from '@/shared/ui/HStack'
import { IconButton } from '@/shared/ui/IconButton'
import {
  BagIcon,
  ClearIcon,
  CloseIcon,
  FilterIcon,
  HeartIcon,
  ProfileIcon,
  SearchIcon,
  SearchOutlineIcon,
} from '@/shared/ui/icons'
import { Input } from '@/shared/ui/Input'
import { SmartLink } from '@/shared/ui/SmartLink'
import { getRouteTitle } from '../lib/getRouteTitle'

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
    {
      id: 'profile',
      icon: ProfileIcon,
      href: ROUTES.PROFILE,
      ariaLabel: 'Профиль',
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

  const headerIconBaseClassName = 'text-white hover:text-white active:bg-primary-300 rounded-md'

  return (
    <>
      <div aria-hidden className="h-20 sm:h-0" />
      <Container
        data-layout-header="true"
        className="bg-primary-500 fixed inset-x-0 top-0 z-40 flex h-20 items-center
          justify-between rounded-none px-4
          sm:static sm:z-auto sm:h-22 sm:px-6
          sm:rounded-t-[40px] sm:pt-1"
      >
        {/* Mobile: search input on /search */}
        {isSearch && (
          <div className="flex flex-1 items-center gap-3 sm:hidden">
            <div className="flex h-10 flex-1 items-center gap-3 rounded-xl bg-white/20 pl-4 pr-1">
              <SearchOutlineIcon className="size-5 shrink-0 text-white/60" aria-hidden />
              <Input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                // Страница поиска на мобильном: поле сразу готово к вводу
                // oxlint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                className="h-auto border-0 bg-transparent p-0 text-base
                  leading-none text-white shadow-none
                  placeholder:text-white/60 focus-visible:ring-0"
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
                  className="text-white/60"
                />
              )}
            </div>
            <IconButton
              icon={CloseIcon}
              size="sm"
              variant="ghost"
              onClick={() => {
                resetSearch()
                router.history.back()
              }}
              aria-label="Закрыть поиск"
              className="text-white"
            />
          </div>
        )}

        {/* Mobile: logo on home, title on other pages */}
        {!isSearch && isHomePage && (
          <SmartLink href={ROUTES.HOME} className="inline-flex items-center justify-center sm:hidden">
            <img
              src="/brand/logo.svg"
              alt="ООО ТТЦ Рембыттехника"
              width={180}
              height={40}
              fetchPriority="high"
              className="h-10 w-45"
            />
          </SmartLink>
        )}
        {!isSearch && !isHomePage && (
          <div className="flex min-h-10 items-center gap-2.5 sm:hidden">
            <p className="text-2xl leading-none font-semibold text-white">{isCatalog ? 'Каталог' : pageTitle}</p>
            {isCart && cartCount > 0 && (
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white">{cartCount}</span>
            )}
          </div>
        )}

        {/* Mobile: close button for wizard flows */}
        {showCloseButton && (
          <button
            type="button"
            onClick={() => {
              // Закрытие мастера вызова: возврат на главную, шторка закроется по смене маршрута
              void router.navigate({ to: ROUTES.HOME })
            }}
            className="inline-flex size-8 items-center justify-center
              rounded-md text-white sm:hidden"
            aria-label="Закрыть"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Mobile: search on catalog, search + filter on subcategory */}
        {!isSearch && isCatalog && (
          <HStack gap={6} className="sm:hidden">
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
          </HStack>
        )}

        {/* Desktop: logo */}
        <SmartLink href={ROUTES.HOME} className="hidden items-center justify-center sm:inline-flex">
          <img src="/brand/logo.svg" alt="ООО ТТЦ Рембыттехника" width={180} height={40} className="h-10 w-45" />
        </SmartLink>

        {/* Desktop: search — one element, CSS-driven expanded/compact */}
        <div
          data-home={isHomePage ? '' : undefined}
          className={cn(
            'group hidden flex-1 justify-center px-6 transition-all duration-500 ease-in-out sm:flex',
            isHomePage && '[@media(min-height:700px)]:translate-y-[clamp(120px,18vh,260px)]',
          )}
        >
          {search}
        </div>

        {/* Desktop: icons */}
        <HStack className="hidden sm:flex" gap={10}>
          {desktopIcons.map(({ id, icon, href, ariaLabel, counter }) => (
            <IconButton
              key={id}
              size="lg"
              icon={icon}
              iconSize={28}
              counter={counter ?? null}
              tooltip={ariaLabel}
              className={headerIconBaseClassName}
              activeClassName="text-inverse aria-[current=page]:text-inverse"
              aria-label={ariaLabel}
              href={href}
            />
          ))}
        </HStack>
      </Container>
    </>
  )
}
