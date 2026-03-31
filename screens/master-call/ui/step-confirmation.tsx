"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Breadcrumb,
  Button,
  Container,
  Heading,
  Text,
} from "@/shared/ui/kit";
import type {
  ApplianceCategory,
  ServiceType,
  TimeSlot,
  TimeSlotGroup,
} from "../model/types";

const TIMER_SECONDS = 1 * 60;
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
  onCancel: () => void;
};

export function StepConfirmation({
  serviceType,
  category,
  selectedGroup,
  selectedSlot,
  onCancel,
}: StepConfirmationProps) {
  const [remaining, setRemaining] = useState(TIMER_SECONDS);

  useEffect(() => {
    if (remaining <= 0) return;
    const id = setInterval(() => setRemaining((r) => r - 1), 1000);
    return () => clearInterval(id);
  }, [remaining]);

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

      <Box className="flex flex-col gap-1">
        <Text className="text-secondary text-[24px] leading-8">
          {SERVICE_TYPE_LABEL[serviceType]} {category.label.toLowerCase()}
        </Text>
        <Text className="text-primary-100 text-[24px] leading-8">
          {selectedGroup.label}, {selectedSlot.start} — {selectedSlot.end}
        </Text>
      </Box>

      <Box>
        {expired ? (
          <Heading size="lg">Время истекло</Heading>
        ) : (
          <p className="text-[24px] leading-8">
            <span className="font-semibold">Подтвердите заявку</span>
            <span className="text-muted">
              {" "}
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
          className="text-[44px] leading-tight font-bold tracking-tight"
        >
          {PHONE_NUMBER}
        </a>
        {!expired && (
          <Box className="flex items-center gap-2">
            <span
              className="text-success-700 inline-block size-4 animate-spin
                rounded-full border-2 border-current border-t-transparent"
            />
            <Text
              size="sm"
              className="text-success-700"
            >
              Ожидаем вашего звонка
            </Text>
          </Box>
        )}
      </Box>

      <Button
        variant="secondary"
        className="self-start"
        onClick={onCancel}
      >
        Отменить заявку
      </Button>

      <Text
        size="xs"
        variant="disabled"
      >
        Позвонив по номеру, вы даете согласие на обработку персональных данных,
        в соответствии с Федеральным законом от 27.07.2006 года №152-ФЗ «О
        персональных данных» для целей и на условиях, представленных в политике
        конфиденциальности
      </Text>
    </Container>
  );
}
