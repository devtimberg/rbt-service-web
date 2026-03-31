"use client";

import { useRouter } from "next/navigation";
import { Button, Text, Heading } from "@/shared/ui/kit";
import { ROUTES } from "@/shared/lib/routes";

export function StepSuccess() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center gap-6 py-8 text-center">
      <span className="text-6xl">✅</span>
      <div className="flex flex-col gap-2">
        <Heading size="md">Заявка принята!</Heading>
        <Text variant="secondary">
          Мастер свяжется с вами в ближайшее время
        </Text>
      </div>
      <Button
        variant="primary"
        size="full"
        onClick={() => router.push(ROUTES.HOME)}
      >
        На главную
      </Button>
    </div>
  );
}
