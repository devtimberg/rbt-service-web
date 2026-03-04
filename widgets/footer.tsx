"use client";

import { useEffect, useState } from "react";

import { Box, Button, Container, HStack, Text } from "@/shared/ui/kit";

const GREETINGS = ["Добро пожаловать", "Welcome", "ようこそ", "欢迎"];

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
    <Container className="mt-auto px-4 py-[clamp(12px,2.5vh,24px)] lg:px-0">
      <HStack className="items-end justify-between gap-4">
        <Text
          variant="secondary"
          size="xs"
          className="min-w-0 flex-1 leading-4 whitespace-pre-wrap"
        >
          {`© 1995 — 2026 ТТЦ Рембыттехника.\nВсе права защищены. Условия использования. Политика конфиденциальности.\nАдрес: г. Челябинск, ул. Производственная д. 8Б, Тел.: +7(351)239-39-39 Email: service@rbt.ru`}
        </Text>
        <HStack
          className="w-[340px] shrink-0 items-center justify-end"
          gap={4}
        >
          <Text className="shrink-0 text-right text-[18px] leading-5 font-semibold whitespace-nowrap">
            {GREETINGS[greetingIndex].slice(0, typedLength)}
            <span
              aria-hidden
              className="animation-duration-[450ms] ml-0.5 inline-block animate-pulse"
            >
              |
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
