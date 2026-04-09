"use client";

import {
  BagIcon,
  ClearIcon,
  CloseIcon,
  FilterIcon,
  HeartIcon,
  ProfileIcon,
  SearchIcon,
  SearchOutlineIcon,
} from "@/shared/icons";
import { ROUTES, getRouteConfig } from "@/shared/lib/routes";
import { useCartStore, useFavoritesStore, useSearchStore } from "@/shared/lib/stores";
import { cn } from "@/shared/lib/utils";
import { Container, HStack, IconButton, Input } from "@/shared/ui/kit";
import { CatalogSearch } from "./catalog-search";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type MouseEvent, useRef } from "react";

const CLOSE_BUTTON_ROUTES: Set<string> = new Set([ROUTES.MASTER_CALL]);

export function Header() {
  const pathname = usePathname();
  const cartCount = useCartStore((s) => s.items.size);
  const favoritesCount = useFavoritesStore((s) => s.items.size);

  const desktopIcons = [
    {
      id: "favorite",
      icon: HeartIcon,
      href: ROUTES.FAVORITE,
      ariaLabel: "Избранное",
      counter: favoritesCount || undefined,
    },
    {
      id: "cart",
      icon: BagIcon,
      href: ROUTES.CART,
      ariaLabel: "Корзина",
      counter: cartCount || undefined,
    },
    {
      id: "profile",
      icon: ProfileIcon,
      href: ROUTES.PROFILE,
      ariaLabel: "Профиль",
    },
  ];
  const router = useRouter();
  const isHomePage = pathname === ROUTES.HOME;
  const isCart = pathname === ROUTES.CART;
  const isCatalog = pathname.startsWith(ROUTES.CATALOG);
  const isCatalogSubpage = isCatalog && pathname !== ROUTES.CATALOG;
  const isSearch = pathname === ROUTES.SEARCH;
  const showCloseButton = CLOSE_BUTTON_ROUTES.has(pathname);
  const pageTitle = getRouteConfig(pathname).title;
  const searchQuery = useSearchStore((s) => s.query);
  const setSearchQuery = useSearchStore((s) => s.setQuery);
  const resetSearch = useSearchStore((s) => s.reset);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const headerIconBaseClassName =
    "text-white hover:text-white active:bg-primary-300 rounded-md";

  const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (window.history.state?.sheet) {
      event.preventDefault();
      window.history.back();
    }
  };

  return (
    <>
      <div
        aria-hidden
        className="h-20 sm:h-0"
      />
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
              <SearchOutlineIcon
                className="size-5 shrink-0 text-white/60"
                aria-hidden
              />
              <Input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                    resetSearch();
                    searchInputRef.current?.focus();
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
                resetSearch();
                router.back();
              }}
              aria-label="Закрыть поиск"
              className="text-white"
            />
          </div>
        )}

        {/* Mobile: logo on home, title on other pages */}
        {!isSearch && isHomePage && (
          <Link
            href={ROUTES.HOME}
            onClick={handleLogoClick}
            className="inline-flex items-center justify-center sm:hidden"
          >
            <Image
              src="/brand/logo.svg"
              alt="ООО ТТЦ Рембыттехника"
              width={180}
              height={40}
              className="h-10 w-45"
              priority
            />
          </Link>
        )}
        {!isSearch && !isHomePage && (
          <div className="flex min-h-10 items-center gap-2.5 sm:hidden">
            <p className="text-2xl leading-none font-semibold text-white">
              {isCatalog ? "Каталог" : pageTitle}
            </p>
            {isCart && cartCount > 0 && (
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white">
                {cartCount}
              </span>
            )}
          </div>
        )}

        {/* Mobile: close button for wizard flows */}
        {showCloseButton && (
          <button
            type="button"
            onClick={() => {
              if (window.history.state?.sheet) {
                router.back();
              } else {
                router.push(ROUTES.HOME);
              }
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
          <HStack
            gap={6}
            className="sm:hidden"
          >
            <IconButton
              variant="inverse"
              size="sm"
              icon={SearchIcon}
              iconSize={28}
              aria-label="Поиск запчастей"
            />
            {isCatalogSubpage && (
              <IconButton
                variant="inverse"
                size="sm"
                icon={FilterIcon}
                iconSize={28}
                aria-label="Фильтры"
              />
            )}
          </HStack>
        )}

        {/* Desktop: logo */}
        <Link
          href={ROUTES.HOME}
          onClick={handleLogoClick}
          className="hidden items-center justify-center sm:inline-flex"
        >
          <Image
            src="/brand/logo.svg"
            alt="ООО ТТЦ Рембыттехника"
            width={180}
            height={40}
            className="h-10 w-45"
          />
        </Link>

        {/* Desktop: search — one element, CSS-driven expanded/compact */}
        <div
          data-home={isHomePage ? "" : undefined}
          className={cn(
            "group hidden flex-1 justify-center px-6 transition-all duration-500 ease-in-out sm:flex",
            isHomePage &&
              "[@media(min-height:700px)]:translate-y-[clamp(120px,18vh,260px)]",
          )}
        >
          <CatalogSearch />
        </div>

        {/* Desktop: icons */}
        <HStack
          className="hidden sm:flex"
          gap={10}
        >
          {desktopIcons.map(({ id, icon, href, ariaLabel, counter }) => (
            <IconButton
              key={id}
              size="lg"
              icon={icon}
              iconSize={28}
              counter={counter}
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
  );
}
