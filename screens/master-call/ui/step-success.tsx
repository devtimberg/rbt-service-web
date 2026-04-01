"use client";

import { CheckIcon } from "@/shared/icons";
import { ROUTES } from "@/shared/lib/routes";
import {
  Box,
  Breadcrumb,
  Button,
  Container,
  Heading,
  SheetFooterSlot,
  Text,
} from "@/shared/ui/kit";
import { useRouter } from "next/navigation";

export function StepSuccess() {
  const router = useRouter();

  const handleClose = () => {
    if (window.history.state?.sheet) {
      router.back();
    } else {
      router.push(ROUTES.HOME);
    }
  };

  return (
    <Container className="flex flex-col gap-8">
      <Breadcrumb
        items={[{ label: "Сервис", href: "/" }, { label: "Вызвать мастера" }]}
      />

      <Heading
        size="xl"
        className="hidden sm:block"
      >
        Вызвать мастера
      </Heading>

      <Box className="flex items-center gap-3">
        <Box className="rounded-xl bg-green-600 p-1">
          <CheckIcon className="text-3xl text-white" />
        </Box>
        <Heading size="lg">Заявка подтверждена</Heading>
      </Box>

      <Heading size="md"># 321-587-15</Heading>

      <Text
        variant="secondary"
        className="max-w-120"
      >
        Спасибо что обратились в наш сервис, в ближайшее время с вами свяжется
        наш менеджер и уточнит детали
      </Text>

      <SheetFooterSlot contentClassName="justify-end">
        <Button
          className="w-full sm:w-auto"
          onClick={handleClose}
        >
          Хорошо
        </Button>
      </SheetFooterSlot>
    </Container>
  );
}
