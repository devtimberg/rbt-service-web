"use client";

import {
  BagIcon,
  CatalogIcon,
  HeartIcon,
  HomeIcon,
  ProfileIcon,
} from "@/shared/icons";
import { HOME_NAV_PATHS, ROUTES } from "@/shared/lib/routes";
import { IconButton } from "@/shared/ui/kit";
import { usePathname } from "next/navigation";
import type { ComponentType, SVGProps } from "react";

const HIDDEN_NAV_ROUTES: Set<string> = new Set([ROUTES.MASTER_CALL]);

type NavItem = {
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  counter?: number;
  additionalActivePaths?: string[];
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Главная",
    href: ROUTES.HOME,
    icon: HomeIcon,
    additionalActivePaths: HOME_NAV_PATHS.filter((p) => p !== ROUTES.HOME),
  },
  {
    label: "Каталог",
    href: ROUTES.CATALOG,
    icon: CatalogIcon,
  },
  {
    label: "Избранное",
    href: ROUTES.FAVORITE,
    icon: HeartIcon,
    counter: 1,
  },
  {
    label: "Корзина",
    href: ROUTES.CART,
    icon: BagIcon,
    counter: 3,
  },
  {
    label: "Профиль",
    href: ROUTES.PROFILE,
    icon: ProfileIcon,
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  if (HIDDEN_NAV_ROUTES.has(pathname)) return null;

  return (
    <nav
      className="shadow-primary-900/15 fixed inset-x-0 bottom-0 z-40
        rounded-t-[24px] bg-[#F7FAFF] px-2 pt-2
        pb-[max(env(safe-area-inset-bottom),8px)] shadow-[0_-0px_60px_-0px]
        sm:hidden"
      aria-label="Мобильная навигация"
    >
      <ul className="grid grid-cols-5 gap-0.5">
        {NAV_ITEMS.map((item) => (
          <li
            key={item.href}
            className="flex min-h-13 items-center justify-center"
          >
            <IconButton
              href={item.href}
              variant="ghost"
              size="lg"
              icon={item.icon}
              iconSize={32}
              counter={item.counter}
              className="text-primary-100 rounded-xl"
              activeClassName="text-primary-500"
              matchPath="prefix"
              additionalActivePaths={item.additionalActivePaths}
              disableHover
              aria-label={item.label}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
