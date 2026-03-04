import Image from "next/image";
import { Container, HStack, IconButton } from "@/shared/ui/kit";
import { BagIcon, ChartIcon, ProfileIcon, HeartIcon } from "@/shared/icons";

export function Header() {
  return (
    <Container className="flex justify-between py-[clamp(16px,4vh,40px)]">
      <Image
        src="/brand/logo.svg"
        alt="ООО ТТЦ Рембыттехника"
        width={180}
        height={40}
        priority
      />
      <HStack gap={10}>
        <IconButton
          size={"lg"}
          icon={HeartIcon}
          iconSize={28}
          counter={null}
          aria-label="Избранное"
          href="/favorite"
        />
        <IconButton
          icon={ChartIcon}
          size={"lg"}
          iconSize={28}
          counter={null}
          aria-label="Сравнение"
          href="/compare"
        />
        <IconButton
          icon={BagIcon}
          size={"lg"}
          iconSize={28}
          counter={3}
          aria-label="Корзина"
          href="/cart"
        />
        <IconButton
          icon={ProfileIcon}
          size={"lg"}
          iconSize={28}
          aria-label="Профиль"
          href="/profile"
        />
      </HStack>
    </Container>
  );
}
