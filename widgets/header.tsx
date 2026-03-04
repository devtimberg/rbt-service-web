import Image from "next/image";
import { ROUTES } from "@/shared/lib/routes";
import { Container, HStack, IconButton } from "@/shared/ui/kit";
import { BagIcon, ChartIcon, ProfileIcon, HeartIcon } from "@/shared/icons";

export function Header() {
  const headerIconClassName = "text-white hover:text-white";

  return (
    <Container className="flex justify-center px-4 py-[clamp(16px,4vh,40px)] sm:justify-between">
      <Image
        src="/brand/logo.svg"
        alt="ООО ТТЦ Рембыттехника"
        width={180}
        height={40}
        priority
      />
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
