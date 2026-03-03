import Image from "next/image";
import { Container, HStack, IconButton } from "@/src/shared/ui/kit";
import { BagIcon, ChartIcon, ProfileIcon, HeartIcon } from "@/src/shared/icons";

export function Header() {
  return (
    <Container className="flex justify-between pt-10">
      <Image
        src="/brand/logo.svg"
        alt="ООО ТТЦ Рембыттехника"
        width={180}
        height={40}
        priority
      />
      <HStack gap={10}>
        <IconButton
          icon={HeartIcon}
          counter={null}
          aria-label="Избранное"
          href="/favorite"
        />
        <IconButton
          icon={ChartIcon}
          counter={null}
          aria-label="Сравнение"
          href="/compare"
        />
        <IconButton
          icon={BagIcon}
          counter={3}
          aria-label="Корзина"
          href="/cart"
        />
        <IconButton
          icon={ProfileIcon}
          aria-label="Профиль"
          href="/profile"
        />
      </HStack>
    </Container>
  );
}
