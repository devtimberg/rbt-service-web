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
import type { FilterGroup } from "@/screens/catalog/model";

type FavoriteFiltersProps = {
  categories: string[];
  availabilityGroup: FilterGroup;
  className?: string;
};

export function FavoriteFilters({
  categories,
  availabilityGroup,
  className,
}: FavoriteFiltersProps) {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(),
  );
  const [selectedAvailability, setSelectedAvailability] = useState("all");

  const activeCount =
    selectedCategories.size + (selectedAvailability !== "all" ? 1 : 0);

  function toggleCategory(value: string) {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return next;
    });
  }

  function resetFilters() {
    setSelectedCategories(new Set());
    setSelectedAvailability("all");
  }

  return (
    <aside
      className={cn(
        "flex w-68! flex-col gap-6 rounded-[24px] bg-white p-6",
        className,
      )}
    >
      {/* Category */}
      <div className="flex flex-col gap-3">
        <Box className="flex items-center justify-between gap-3">
          <Heading size="xs" className="h-5 text-[16px]! font-bold!">
            Категория
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

        <div className="flex flex-col gap-2.5">
          {categories.map((category) => (
            <label
              key={category}
              className="flex cursor-pointer items-start gap-2.5"
            >
              <Checkbox
                checked={selectedCategories.has(category)}
                onCheckedChange={() => toggleCategory(category)}
                className="mt-0.5"
              />
              <span className="text-pretty text-sm">{category}</span>
            </label>
          ))}
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
