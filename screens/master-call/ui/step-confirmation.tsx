import { Button, Text } from "@/shared/ui/kit";
import { Input } from "@/shared/ui/kit/input";
import type { ApplianceCategory, TimeSlot, TimeSlotGroup } from "../model/types";

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
  return (
    <div className="flex flex-col gap-5">
      <button
        type="button"
        onClick={onBack}
        className="cursor-pointer self-start text-sm text-gray-400 hover:text-gray-700"
      >
        ← Назад
      </button>

      <div className="flex flex-col gap-3 rounded-xl bg-gray-50 p-4">
        <div className="flex items-center gap-2">
          <Text>{category.label}</Text>
        </div>
        <div className="h-px bg-gray-200" />
        <Text size="sm" variant="secondary">
          {selectedGroup.label}, {selectedSlot.start} – {selectedSlot.end}
        </Text>
      </div>

      <div className="flex flex-col gap-3">
        <Text size="sm" variant="secondary">
          Позвоните для подтверждения заявки
        </Text>
        <Button variant="primary" size="full" rounded="full" asChild>
          <a href="tel:88003335556">📞 Позвонить 8-800-333-555-6</a>
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <Text size="sm" variant="secondary">
          или
        </Text>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <div className="flex flex-col gap-3">
        <Text size="sm" variant="secondary">
          Оставьте номер — мы перезвоним
        </Text>
        <Input
          type="tel"
          placeholder="+7 (___) ___-__-__"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          className="rounded-xl"
        />
        <Button
          variant="secondary"
          size="full"
          disabled={phone.length < 6}
          onClick={onSubmit}
        >
          Отправить заявку
        </Button>
      </div>
    </div>
  );
}
