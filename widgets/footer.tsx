"use client";

import { useEffect, useState } from "react";

import { Box, Button, Container, HStack, Text } from "@/shared/ui/kit";

const GREETINGS = ["Добро пожаловать", "Welcome", "ようこそ", "欢迎"];
const LONGEST_GREETING = GREETINGS.reduce((longest, current) =>
  current.length > longest.length ? current : longest,
);

export function Footer() {
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [typedLength, setTypedLength] = useState(0);

  useEffect(() => {
    const currentGreeting = GREETINGS[greetingIndex];
    let timer: ReturnType<typeof setTimeout>;

    if (typedLength < currentGreeting.length) {
      timer = setTimeout(() => {
        setTypedLength((prev) => prev + 1);
      }, 110);
    } else {
      timer = setTimeout(() => {
        setGreetingIndex((prev) => (prev + 1) % GREETINGS.length);
        setTypedLength(0);
      }, 1700);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [greetingIndex, typedLength]);

  return (
    <Container className="mt-auto px-4 py-[clamp(12px,2.5vh,24px)]">
      <HStack className="flex-col-reverse items-center justify-center gap-4 md:flex-row md:items-end md:justify-between">
        <Text
          variant="secondary"
          size="xs"
          className="min-w-0 flex-1 text-center leading-4 whitespace-pre-wrap md:text-left"
        >
          {`© 1995 — 2026 ТТЦ Рембыттехника.\nВсе права защищены. Условия использования. Политика конфиденциальности.\nАдрес: г. Челябинск, ул. Производственная д. 8Б, Тел.: +7(351)239-39-39 Email: service@rbt.ru`}
        </Text>
        <HStack
          className="w-[340px] shrink-0 items-center justify-center md:justify-end"
          gap={4}
        >
          <Text className="relative shrink-0 text-center text-[18px] leading-5 font-semibold whitespace-nowrap md:text-right">
            <span className="invisible">
              {LONGEST_GREETING}
              <span
                aria-hidden
                className="ml-0.5 inline-block"
              >
                |
              </span>
            </span>
            <span className="absolute inset-0">
              {GREETINGS[greetingIndex].slice(0, typedLength)}
              <span
                aria-hidden
                className="animation-duration-[450ms] ml-0.5 inline-block animate-pulse"
              >
                |
              </span>
            </span>
          </Text>
          <Box>
            <Button
              variant="inverse"
              size="lg"
            >
              Время работы
            </Button>
          </Box>
        </HStack>
      </HStack>
    </Container>
  );
}
