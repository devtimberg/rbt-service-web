import type { TimeSlotGroup } from "./types";

const SLOT_TEMPLATES = [
  { start: "09:00", end: "11:00" },
  { start: "11:00", end: "13:00" },
  { start: "14:00", end: "16:00" },
  { start: "16:00", end: "18:00" },
];

const UNAVAILABLE_SLOTS = new Set(["0-0", "1-2", "2-3"]);

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
});

const DAY_LABELS = ["Сегодня", "Завтра", "Послезавтра"];

export function getTimeSlotGroups(): TimeSlotGroup[] {
  const today = new Date();

  return Array.from({ length: 3 }, (_, dayIndex) => {
    const date = new Date(today);
    date.setDate(today.getDate() + dayIndex);

    const formattedDate = dateFormatter.format(date);
    const label = `${DAY_LABELS[dayIndex]}, ${formattedDate}`;

    const slots = SLOT_TEMPLATES.map((template, slotIndex) => ({
      key: `${dayIndex}-${slotIndex}`,
      start: template.start,
      end: template.end,
      available: !UNAVAILABLE_SLOTS.has(`${dayIndex}-${slotIndex}`),
    }));

    return { key: `day-${dayIndex}`, label, slots };
  });
}
