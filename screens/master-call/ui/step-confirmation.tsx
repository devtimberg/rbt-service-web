"use client";

import {
  Box,
  Breadcrumb,
  Button,
  Container,
  Heading,
  SheetFooterSlot,
  Text,
} from "@/shared/ui/kit";
import { useEffect, useState } from "react";
import type {
  ApplianceCategory,
  ServiceType,
  TimeSlot,
  TimeSlotGroup,
} from "../model/types";

const TIMER_SECONDS = 1 * 10;
const PHONE_NUMBER = "8-800-333-555-6";
const PHONE_HREF = "tel:88003335556";

const SERVICE_TYPE_LABEL: Record<ServiceType, string> = {
  repair: "Ремонт",
  installation: "Установка",
};

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

type StepConfirmationProps = {
  serviceType: ServiceType;
  category: ApplianceCategory;
  selectedGroup: TimeSlotGroup;
  selectedSlot: TimeSlot;
  cancelAction: () => void;
  confirmedAction: () => void;
};

export function StepConfirmation({
  serviceType,
  category,
  selectedGroup,
  selectedSlot,
  cancelAction,
  confirmedAction,
}: StepConfirmationProps) {
  const [remaining, setRemaining] = useState(TIMER_SECONDS);

  useEffect(() => {
    if (remaining <= 0) return;
    const id = setInterval(() => setRemaining((r) => r - 1), 1000);
    return () => clearInterval(id);
  }, [remaining]);

  useEffect(() => {
    if (remaining <= 0) {
      confirmedAction();
    }
  }, [remaining, confirmedAction]);

  const expired = remaining <= 0;

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

      <Box
        className="text-tertiary flex flex-col text-[21px] leading-8
          sm:text-[24px]"
      >
        <span>
          {SERVICE_TYPE_LABEL[serviceType]} {category.label.toLowerCase()}
        </span>
        <span>{selectedGroup.label},</span>
        <span>
          {selectedSlot.start} — {selectedSlot.end}
        </span>
      </Box>

      <Box>
        {expired ? (
          <Heading size="lg">Время истекло</Heading>
        ) : (
          <p className="text-[21px] leading-8 sm:text-[24px]">
            <span className="font-semibold">Подтвердите заявку</span>
            <br />
            <span className="text-tertiary">
              в течении {formatTimer(remaining)}
            </span>
          </p>
        )}
      </Box>

      <Box className="flex flex-col gap-3">
        <Text
          size="sm"
          className="font-semibold"
        >
          Позвоните на бесплатный номер
        </Text>
        <a
          href={PHONE_HREF}
          className="text-[32px] leading-tight font-bold tracking-tight
            sm:text-[44px]"
        >
          {PHONE_NUMBER}
        </a>
        {!expired && (
          <Box className="flex items-center gap-2">
            <span
              className="text-primary-500 inline-block size-4 animate-spin
                rounded-full border-2 border-current border-t-transparent"
            />
            <Text
              size="sm"
              className="text-primary-500"
            >
              Ожидаем вашего звонка
            </Text>
          </Box>
        )}
      </Box>

      <Button
        variant="secondary"
        className="self-start"
        onClick={cancelAction}
      >
        Отменить заявку
      </Button>

      <Text
        size="xs"
        variant="disabled"
        className="max-w-130"
      >
        Позвонив по номеру, вы даете согласие на обработку персональных данных,
        в соответствии с Федеральным законом от 27.07.2006 года №152-ФЗ «О
        персональных данных» для целей и на условиях, представленных в политике
        конфиденциальности
      </Text>

      <SheetFooterSlot className="sm:hidden">
        <Button
          className="w-full"
          onClick={() => window.location.assign(PHONE_HREF)}
        >
          Позвонить
        </Button>
      </SheetFooterSlot>
    </Container>
  );
}
