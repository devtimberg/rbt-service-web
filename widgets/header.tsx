"use client";

import Image from "next/image";
import Link, { type LinkProps } from "next/link";
import { ROUTES, type AppRoute } from "@/shared/lib/routes";
import { Container, HStack, IconButton } from "@/shared/ui/kit";
import {
  BagIcon,
  ChartIcon,
  HeartIcon,
  ProfileIcon,
  SearchIcon,
} from "@/shared/icons";
import { usePathname } from "next/navigation";
import type { ElementType, MouseEvent, SVGProps } from "react";

const ROUTE_TITLES: Record<string, string> = {
  [ROUTES.HOME]: "Рембыттехника",
  [ROUTES.CATALOG]: "Каталог",
  [ROUTES.FAVORITE]: "Избранное",
  [ROUTES.COMPARE]: "Сравнение",
  [ROUTES.CART]: "Корзина",
  [ROUTES.PROFILE]: "Профиль",
  [ROUTES.ORDERS_STATUS]: "Статус заказа",
  [ROUTES.PARTS_REQUEST]: "Заявка на запчасти",
  [ROUTES.SERVICES_REPAIR]: "Ремонт",
  [ROUTES.MASTER_CALL]: "Вызов мастера",
  [ROUTES.FEEDBACK]: "Обратная связь",
};
type HeaderIconConfig = {
  id: string;
  icon: ElementType<SVGProps<SVGSVGElement>>;
  href: LinkProps["href"];
  ariaLabel: string;
  counter?: number | null;
};
type HeaderRouteConfig = {
  mobileIcons?: HeaderIconConfig[];
  desktopIcons?: HeaderIconConfig[];
};
const DEFAULT_MOBILE_ICONS: HeaderIconConfig[] = [
  {
    id: "favorite",
    icon: HeartIcon,
    href: ROUTES.FAVORITE,
    ariaLabel: "Избранное",
    counter: null,
  },
  {
    id: "cart",
    icon: BagIcon,
    href: ROUTES.CART,
    ariaLabel: "Корзина",
    counter: null,
  },
];
const DEFAULT_DESKTOP_ICONS: HeaderIconConfig[] = [
  {
    id: "favorite",
    icon: HeartIcon,
    href: ROUTES.FAVORITE,
    ariaLabel: "Избранное",
    counter: null,
  },
  {
    id: "compare",
    icon: ChartIcon,
    href: ROUTES.COMPARE,
    ariaLabel: "Сравнение",
    counter: null,
  },
  {
    id: "cart",
    icon: BagIcon,
    href: ROUTES.CART,
    ariaLabel: "Корзина",
    counter: 3,
  },
  {
    id: "profile",
    icon: ProfileIcon,
    href: ROUTES.PROFILE,
    ariaLabel: "Профиль",
  },
];
const CATALOG_MOBILE_ICONS: HeaderIconConfig[] = [
  {
    id: "search",
    icon: SearchIcon,
    href: "/search",
    ariaLabel: "Поиск запчастей",
  },
];
const HEADER_ROUTE_CONFIG: Partial<Record<AppRoute, HeaderRouteConfig>> = {
  [ROUTES.HOME]: {
    mobileIcons: DEFAULT_MOBILE_ICONS,
    desktopIcons: DEFAULT_DESKTOP_ICONS,
  },
  [ROUTES.CATALOG]: {
    mobileIcons: DEFAULT_MOBILE_ICONS,
    desktopIcons: DEFAULT_DESKTOP_ICONS,
  },
  [ROUTES.FAVORITE]: {
    mobileIcons: DEFAULT_MOBILE_ICONS,
    desktopIcons: DEFAULT_DESKTOP_ICONS,
  },
  [ROUTES.COMPARE]: {
    mobileIcons: DEFAULT_MOBILE_ICONS,
    desktopIcons: DEFAULT_DESKTOP_ICONS,
  },
  [ROUTES.CART]: {
    mobileIcons: DEFAULT_MOBILE_ICONS,
    desktopIcons: DEFAULT_DESKTOP_ICONS,
  },
  [ROUTES.PROFILE]: {
    mobileIcons: DEFAULT_MOBILE_ICONS,
    desktopIcons: DEFAULT_DESKTOP_ICONS,
  },
  [ROUTES.ORDERS_STATUS]: {
    mobileIcons: [{ id: "cart", icon: BagIcon, href: ROUTES.CART, ariaLabel: "Корзина", counter: null }],
    desktopIcons: DEFAULT_DESKTOP_ICONS,
  },
  [ROUTES.PARTS_REQUEST]: {
    mobileIcons: [{ id: "cart", icon: BagIcon, href: ROUTES.CART, ariaLabel: "Корзина", counter: null }],
    desktopIcons: DEFAULT_DESKTOP_ICONS,
  },
  [ROUTES.SERVICES_REPAIR]: {
    mobileIcons: DEFAULT_MOBILE_ICONS,
    desktopIcons: DEFAULT_DESKTOP_ICONS,
  },
  [ROUTES.MASTER_CALL]: {
    mobileIcons: [{ id: "favorite", icon: HeartIcon, href: ROUTES.FAVORITE, ariaLabel: "Избранное", counter: null }],
    desktopIcons: DEFAULT_DESKTOP_ICONS,
  },
  [ROUTES.FEEDBACK]: {
    mobileIcons: [{ id: "profile", icon: ProfileIcon, href: ROUTES.PROFILE, ariaLabel: "Профиль" }],
    desktopIcons: DEFAULT_DESKTOP_ICONS,
  },
};

function getHeaderConfig(pathname: string): HeaderRouteConfig {
  return (
    HEADER_ROUTE_CONFIG[pathname as AppRoute] ?? {
      mobileIcons: DEFAULT_MOBILE_ICONS,
      desktopIcons: DEFAULT_DESKTOP_ICONS,
    }
  );
}

export function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === ROUTES.HOME;
  const mobileHeaderSpacerClass =
    "h-[calc(40px+2*(clamp(16px,4vh,40px)/1.5))] sm:h-0";
  const pageTitle = ROUTE_TITLES[pathname] ?? "Рембыттехника";
  const routeConfig = getHeaderConfig(pathname);
  const mobileIcons =
    pathname === ROUTES.CATALOG ? CATALOG_MOBILE_ICONS : [];
  const desktopIcons = routeConfig.desktopIcons ?? DEFAULT_DESKTOP_ICONS;
  const headerIconClassName = "text-white hover:text-white";
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
        className={mobileHeaderSpacerClass}
      />
      <Container
        data-layout-header="true"
        className="bg-primary-500 fixed inset-x-0 top-0 z-40 flex items-center justify-between rounded-none px-4 py-[calc(clamp(16px,4vh,40px)/1.5)] transition-[padding] duration-300 ease-in-out sm:static sm:z-auto sm:rounded-t-[40px] sm:py-[clamp(16px,4vh,40px)]"
      >
        {isHomePage ? (
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
              className="h-[40px] w-[180px]"
              priority
            />
          </Link>
        ) : (
          <p className="text-2xl leading-none font-semibold text-white sm:hidden min-h-10 flex items-center">
            {pageTitle}
          </p>
        )}
        <HStack
          className="flex min-h-10 sm:hidden"
          gap={6}
        >
          {mobileIcons.map(({ id, icon, href, ariaLabel, counter }) => (
            <IconButton
              key={id}
              size={"sm"}
              icon={icon}
              iconSize={28}
              counter={counter ?? null}
              className={headerIconClassName}
              aria-label={ariaLabel}
              href={href}
            />
          ))}
        </HStack>
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
            className="h-[40px] w-[180px]"
            priority
          />
        </Link>
        <HStack
          className="hidden sm:flex"
          gap={10}
        >
          {desktopIcons.map(({ id, icon, href, ariaLabel, counter }) => (
            <IconButton
              key={id}
              size={"lg"}
              icon={icon}
              iconSize={28}
              counter={counter}
              className={headerIconClassName}
              aria-label={ariaLabel}
              href={href}
            />
          ))}
        </HStack>
      </Container>
    </>
  );
}
