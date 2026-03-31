import { Button, Text } from "@/shared/ui/kit";
import type { ApplianceCategory, TimeSlot, TimeSlotGroup } from "../model/types";
import { cn } from "@/shared/lib/utils";

type StepTimeSlotProps = {
  category: ApplianceCategory;
  groups: TimeSlotGroup[];
  selected: { group: TimeSlotGroup; slot: TimeSlot } | null;
  onSelect: (group: TimeSlotGroup, slot: TimeSlot) => void;
  onNext: () => void;
  onBack: () => void;
};

export function StepTimeSlot({
  category,
  groups,
  selected,
  onSelect,
  onNext,
  onBack,
}: StepTimeSlotProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="cursor-pointer text-sm text-gray-400 hover:text-gray-700"
        >
          ← Назад
        </button>
        <Text size="sm" variant="secondary">
          · {category.label}
        </Text>
      </div>

      <Text size="sm" variant="secondary">
        Выберите удобное время
      </Text>

      <div className="flex flex-col gap-5">
        {groups.map((group) => (
          <div key={group.key} className="flex flex-col gap-2">
            <Text size="sm" className="font-medium">
              {group.label}
            </Text>
            <div className="flex flex-wrap gap-2">
              {group.slots.map((slot) => {
                const isSelected =
                  selected?.group.key === group.key &&
                  selected?.slot.key === slot.key;

                return (
                  <button
                    key={slot.key}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => onSelect(group, slot)}
                    className={cn(
                      "cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors",
                      isSelected
                        ? "border-primary-500 bg-primary-500 text-white"
                        : "border-gray-200 bg-gray-50 hover:bg-gray-100",
                      !slot.available &&
                        "pointer-events-none cursor-not-allowed opacity-40 line-through",
                    )}
                  >
                    {slot.start} – {slot.end}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="primary"
        size="full"
        disabled={!selected}
        onClick={onNext}
        className="mt-2"
      >
        Далее
      </Button>
    </div>
  );
}
