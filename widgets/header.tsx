"use client";

import Image from "next/image";
import { ROUTES } from "@/shared/lib/routes";
import { Container, HStack, IconButton } from "@/shared/ui/kit";
import { BagIcon, ChartIcon, ProfileIcon, HeartIcon } from "@/shared/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";

const SHEET_ROUTES = new Set<string>([
  ROUTES.CATALOG,
  ROUTES.FAVORITE,
  ROUTES.COMPARE,
  ROUTES.CART,
  ROUTES.PROFILE,
]);

export function Header() {
  const pathname = usePathname();
  const isCompactHeader = SHEET_ROUTES.has(pathname);
  const headerIconClassName = "text-white hover:text-white";
  const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (window.history.state?.sheet) {
      event.preventDefault();
      window.history.back();
    }
  };

  return (
    <Container
      data-layout-header="true"
      className={`bg-primary-500 flex items-center justify-center rounded-t-[40px] px-4 transition-[padding] duration-300 ease-in-out sm:justify-between ${isCompactHeader ? "py-[calc(clamp(16px,4vh,40px)/1.5)] sm:py-[clamp(16px,4vh,40px)]" : "py-[clamp(16px,4vh,40px)]"}`}
    >
      <Link
        href={ROUTES.HOME}
        onClick={handleLogoClick}
        className="inline-flex items-center justify-center"
      >
        <Image
          src="/brand/logo.svg"
          alt="ООО ТТЦ Рембыттехника"
          width={180}
          height={40}
          className={`transition-[width,height] duration-300 ease-in-out ${isCompactHeader ? "h-[27px] w-[120px] sm:h-[40px] sm:w-[180px]" : "h-[40px] w-[180px]"}`}
          priority
        />
      </Link>
      <HStack
        className="hidden sm:flex"
        gap={10}
      >
        <IconButton
          size={"lg"}
          icon={HeartIcon}
          iconSize={28}
          counter={null}
          className={headerIconClassName}
          aria-label="Избранное"
          href={ROUTES.FAVORITE}
        />
        <IconButton
          icon={ChartIcon}
          size={"lg"}
          iconSize={28}
          counter={null}
          className={headerIconClassName}
          aria-label="Сравнение"
          href={ROUTES.COMPARE}
        />
        <IconButton
          icon={BagIcon}
          size={"lg"}
          iconSize={28}
          counter={3}
          className={headerIconClassName}
          aria-label="Корзина"
          href={ROUTES.CART}
        />
        <IconButton
          icon={ProfileIcon}
          size={"lg"}
          iconSize={28}
          className={headerIconClassName}
          aria-label="Профиль"
          href={ROUTES.PROFILE}
        />
      </HStack>
    </Container>
  );
}
