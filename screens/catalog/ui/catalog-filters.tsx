"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Heading,
  RadioGroup,
  RadioGroupItem,
  Text,
} from "@/shared/ui/kit";
import { cn } from "@/shared/lib/utils";
import type { FilterGroup, PriceRange } from "../model";

type CatalogFiltersProps = {
  filterGroups: FilterGroup[];
  availabilityGroup: FilterGroup;
  priceRange: PriceRange;
  className?: string;
};

export function CatalogFilters({
  filterGroups,
  availabilityGroup,
  priceRange,
  className,
}: CatalogFiltersProps) {
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, Set<string>>
  >({});
  const [selectedAvailability, setSelectedAvailability] = useState("all");

  const activeCount = Object.values(selectedFilters).reduce(
    (sum, set) => sum + set.size,
    0,
  );

  function toggleFilter(groupTitle: string, value: string) {
    setSelectedFilters((prev) => {
      const next = { ...prev };
      const set = new Set(next[groupTitle] ?? []);
      if (set.has(value)) {
        set.delete(value);
      } else {
        set.add(value);
      }
      next[groupTitle] = set;
      return next;
    });
  }

  function resetFilters() {
    setSelectedFilters({});
    setSelectedAvailability("all");
  }

  return (
    <aside
      className={cn(
        "flex w-68! flex-col gap-6 rounded-[24px] bg-white p-6",
        className,
      )}
    >
      {/* Header */}
      <Box className="flex items-center justify-between gap-3">
        <Heading
          size="xs"
          className="h-5 text-[16px]! font-bold!"
        >
          Фильтры
        </Heading>
        {activeCount > 0 && (
          <Box className="flex gap-1.5">
            <Button
              variant="link"
              onClick={resetFilters}
              className="text-link inline-flex items-center gap-1.5 text-sm"
            >
              Сбросить
            </Button>
            <span
              className="bg-secondary-500 flex size-5 items-center
                justify-center rounded-full text-xs font-medium text-white"
            >
              {activeCount}
            </span>
          </Box>
        )}
      </Box>

      {/* Filter groups */}
      {filterGroups.map((group) => (
        <div
          key={group.title}
          className="flex flex-col gap-3"
        >
          <Text className="font-medium">{group.title}</Text>
          <div className="flex flex-col gap-2.5">
            {group.options.map((option) => {
              const checked =
                selectedFilters[group.title]?.has(option.value) ?? false;
              return (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-2.5"
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() =>
                      toggleFilter(group.title, option.value)
                    }
                  />
                  <span className="text-sm">{option.label}</span>
                  {option.count != null && (
                    <span className="text-tertiary ml-auto text-sm">
                      {option.count}
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </div>
      ))}

      {/* Price range */}
      <div className="flex flex-col gap-3">
        <Text className="font-medium">Цена, ₽</Text>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder={`от ${priceRange.min}`}
            className="border-border-default placeholder:text-input-placeholder
              focus:border-primary-500 h-10 w-full rounded-xl border px-3
              text-sm outline-none"
          />
          <span className="text-disabled shrink-0">—</span>
          <input
            type="text"
            placeholder={`до ${priceRange.max.toLocaleString("ru-RU")}`}
            className="border-border-default placeholder:text-input-placeholder
              focus:border-primary-500 h-10 w-full rounded-xl border px-3
              text-sm outline-none"
          />
        </div>
      </div>

      {/* Availability */}
      <div className="flex flex-col gap-3">
        <Text className="font-medium">{availabilityGroup.title}</Text>
        <RadioGroup
          value={selectedAvailability}
          onValueChange={setSelectedAvailability}
          className="gap-2.5"
        >
          {availabilityGroup.options.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2.5"
            >
              <RadioGroupItem value={option.value} />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </RadioGroup>
      </div>
    </aside>
  );
}
