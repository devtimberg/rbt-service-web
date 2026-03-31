import {
  Box,
  Breadcrumb,
  Button,
  Container,
  Heading,
  SheetFooterSlot,
  Text,
} from "@/shared/ui/kit";
import { Input } from "@/shared/ui/kit/input";
import type {
  ApplianceCategory,
  TimeSlot,
  TimeSlotGroup,
} from "../model/types";

type StepConfirmationProps = {
  category: ApplianceCategory;
  selectedGroup: TimeSlotGroup;
  selectedSlot: TimeSlot;
  phone: string;
  onPhoneChange: (value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
};

export function StepConfirmation({
  category,
  selectedGroup,
  selectedSlot,
  phone,
  onPhoneChange,
  onSubmit,
  onBack,
}: StepConfirmationProps) {
  const canSubmit = phone.length >= 6;

  return (
    <Container className="flex flex-col gap-10">
      <Breadcrumb
        items={[{ label: "Сервис", href: "/" }, { label: "Вызвать мастера" }]}
      />

      <Heading
        size="xl"
        className="hidden sm:block"
      >
        Вызвать мастера
      </Heading>

      <Box className="flex flex-col gap-3 rounded-xl bg-gray-50 p-4">
        <Text>{category.label}</Text>
        <div className="h-px bg-gray-200" />
        <Text
          size="sm"
          variant="secondary"
        >
          {selectedGroup.label}, {selectedSlot.start} – {selectedSlot.end}
        </Text>
      </Box>

      <Box className="flex flex-col gap-3">
        <Text
          size="sm"
          variant="secondary"
        >
          Позвоните для подтверждения заявки
        </Text>
        <Button asChild>
          <a href="tel:88003335556">Позвонить 8-800-333-555-6</a>
        </Button>
      </Box>

      <Box className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <Text
          size="sm"
          variant="secondary"
        >
          или
        </Text>
        <div className="h-px flex-1 bg-gray-200" />
      </Box>

      <Box className="flex flex-col gap-3">
        <Text
          size="sm"
          variant="secondary"
        >
          Оставьте номер — мы перезвоним
        </Text>
        <Input
          type="tel"
          placeholder="+7 (___) ___-__-__"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          className="rounded-xl"
        />
      </Box>

      <SheetFooterSlot>
        <Box className="shadow-primary-900/15 flex items-center justify-between rounded-t-[24px] bg-[#F7FAFF] px-4 py-4 shadow-[0_-0px_60px_-0px]">
          <Button
            variant="secondary"
            onClick={onBack}
          >
            Назад
          </Button>
          <Button
            disabled={!canSubmit}
            onClick={onSubmit}
          >
            Отправить заявку
          </Button>
        </Box>
      </SheetFooterSlot>
    </Container>
  );
}
