"use client";

import { Text, VStack } from "@/shared/ui/kit";

const SCHEDULES = [
  {
    title: "СЕРВИС",
    lines: ["ПН-СБ: с 8-30 до 17-30 без перерыва", "ВС: выходной"],
  },
  {
    title: "МАГАЗИН ЗАПЧАСТЕЙ",
    lines: [
      "ПН-ПТ: с 8-30 до 17-30; обед с 12.30 до 13.00",
      "СБ-ВС: выходной",
    ],
  },
] as const;

export function WorkingHoursContent() {
  return (
    <VStack gap={10}>
      {SCHEDULES.map((schedule) => (
        <VStack
          key={schedule.title}
          gap={2}
        >
          <Text
            size="sm"
            className="font-bold"
          >
            {schedule.title}
          </Text>
          {schedule.lines.map((line) => (
            <Text
              key={line}
              size="sm"
              className="text-secondary"
            >
              {line}
            </Text>
          ))}
        </VStack>
      ))}
    </VStack>
  );
}
