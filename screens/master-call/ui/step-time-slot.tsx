import { useState } from "react";

import {
  Box,
  Breadcrumb,
  Button,
  Chip,
  Container,
  Heading,
  SheetFooterSlot,
  Text,
} from "@/shared/ui/kit";
import { cn } from "@/shared/lib/utils";
import type { TimeSlot, TimeSlotGroup } from "../model/types";

type StepTimeSlotProps = {
  groups: TimeSlotGroup[];
  selected: { group: TimeSlotGroup; slot: TimeSlot } | null;
  selectAction: (group: TimeSlotGroup, slot: TimeSlot) => void;
  nextAction: () => void;
  backAction: () => void;
};

export function StepTimeSlot({
  groups,
  selected,
  selectAction,
  nextAction,
  backAction,
}: StepTimeSlotProps) {
  const [submitted, setSubmitted] = useState(false);

  const handleNext = () => {
    setSubmitted(true);
    if (selected) {
      nextAction();
    }
  };

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

      <Heading size="lg">Выберите удобное время для визита мастера</Heading>

      <Box className="flex flex-col gap-8">
        {groups.map((group) => (
          <Box
            key={group.key}
            className="flex flex-col gap-4"
          >
            <Heading size="sm">{group.label}</Heading>
            <Box className="-mx-4 flex gap-3 overflow-x-auto px-4 scrollbar-none [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:gap-4 sm:overflow-x-visible sm:px-0">
              {group.slots.map((slot) => {
                const isSelected =
                  selected?.group.key === group.key &&
                  selected?.slot.key === slot.key;

                return (
                  <Chip
                    key={slot.key}
                    size="lg"
                    selected={isSelected}
                    disabled={!slot.available}
                    onClick={() => selectAction(group, slot)}
                    className={cn(
                      "shrink-0",
                      !slot.available && "opacity-40 line-through",
                    )}
                  >
                    {slot.start} — {slot.end}
                  </Chip>
                );
              })}
            </Box>
          </Box>
        ))}
      </Box>

      <SheetFooterSlot contentClassName="justify-between">
        <Button
          variant="secondary"
          onClick={backAction}
        >
          Назад
        </Button>
        <Box className="flex items-center gap-3">
          {submitted && !selected && (
            <Text
              variant="error"
              size="sm"
            >
              Выберите время
            </Text>
          )}
          <Button onClick={handleNext}>Продолжить</Button>
        </Box>
      </SheetFooterSlot>
    </Container>
  );
}
