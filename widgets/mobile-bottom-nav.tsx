"use client";

import {
  BagIcon,
  CatalogIcon,
  HeartIcon,
  HomeIcon,
  ProfileIcon,
} from "@/shared/icons";
import { ROUTES } from "@/shared/lib/routes";
import { cn } from "@/shared/lib/utils";
import Link from "next/link";
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
      className="border-primary-200 fixed inset-x-0 bottom-0 z-40 rounded-t-[24px] border-t bg-white px-2 pt-2 pb-[max(env(safe-area-inset-bottom),8px)] sm:hidden"
      aria-label="Мобильная навигация"
    >
      <ul className="grid grid-cols-5 gap-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const hasCounter =
            typeof item.counter === "number" &&
            Number.isFinite(item.counter) &&
            item.counter > 0;
          const counterContent =
            typeof item.counter === "number" && item.counter > 99
              ? "99+"
              : item.counter;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex min-h-[52px] items-center justify-center rounded-xl px-1 py-2 transition-colors",
                )}
                aria-current={isActive ? "page" : undefined}
                aria-label={item.label}
              >
                <span className="relative inline-flex">
                  <Icon
                    className={cn(
                      "size-8",
                      isActive ? "text-primary-500" : "text-primary-100",
                    )}
                    aria-hidden
                  />
                  {hasCounter ? (
                    <span className="bg-destructive absolute -top-1 -right-2 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-none font-semibold text-white">
                      {counterContent}
                    </span>
                  ) : null}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
