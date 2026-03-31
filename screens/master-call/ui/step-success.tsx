"use client";

import { useRouter } from "next/navigation";
import { Box, Button, Container, Heading, Text } from "@/shared/ui/kit";
import { ROUTES } from "@/shared/lib/routes";

export function StepSuccess() {
  const router = useRouter();

  return (
    <Container className="flex flex-col items-center gap-6 py-8 text-center">
      <span className="text-6xl">✅</span>
      <Box className="flex flex-col gap-2">
        <Heading size="md">Заявка принята!</Heading>
        <Text variant="secondary">
          Мастер свяжется с вами в ближайшее время
        </Text>
      </Box>
      <Button onClick={() => router.push(ROUTES.HOME)}>На главную</Button>
    </Container>
  );
}
