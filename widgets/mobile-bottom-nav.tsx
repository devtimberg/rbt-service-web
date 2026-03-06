"use client";

import {
  BagIcon,
  CatalogIcon,
  HeartIcon,
  HomeIcon,
  ProfileIcon,
} from "@/shared/icons";
import { ROUTES } from "@/shared/lib/routes";
import { IconButton } from "@/shared/ui/kit";
import { usePathname } from "next/navigation";
import type { ComponentType, SVGProps } from "react";

type NavItem = {
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  counter?: number;
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Главная",
    href: ROUTES.HOME,
    icon: HomeIcon,
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

  return (
    <nav
      className="shadow-primary-900/15 fixed inset-x-0 bottom-0 z-40 rounded-t-[24px] bg-white px-2 pt-2 pb-[max(env(safe-area-inset-bottom),8px)] shadow-[0_-0px_60px_-0px] sm:hidden"
      aria-label="Мобильная навигация"
    >
      <ul className="grid grid-cols-5 gap-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li
              key={item.href}
              className="flex min-h-[52px] items-center justify-center"
            >
              <IconButton
                href={item.href}
                variant="ghost"
                size="lg"
                icon={item.icon}
                iconSize={32}
                counter={item.counter}
                className="rounded-xl"
                aria-current={isActive ? "page" : undefined}
                aria-label={item.label}
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
