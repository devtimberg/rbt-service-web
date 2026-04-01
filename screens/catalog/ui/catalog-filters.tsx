"use client";

import { useState } from "react";
import { Heading, Text } from "@/shared/ui/kit";
import { cn } from "@/shared/lib/utils";
import type { FilterGroup, PriceRange } from "../model";

type CatalogFiltersProps = {
  filterGroups: FilterGroup[];
  availabilityGroup: FilterGroup;
  priceRange: PriceRange;
  className?: string;
};

function CheckboxItem({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5">
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
          checked
            ? "border-primary-500 bg-primary-500 text-white"
            : "border-border-strong bg-white",
        )}
      >
        {checked && (
          <svg viewBox="0 0 12 12" fill="none" className="size-3">
            <path
              d="M2.5 6L5 8.5L9.5 3.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className="text-sm">{label}</span>
      {count != null && (
        <span className="ml-auto text-sm text-tertiary">{count}</span>
      )}
    </label>
  );
}

function RadioItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5">
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          checked ? "border-primary-500" : "border-border-strong",
        )}
      >
        {checked && (
          <span className="size-2.5 rounded-full bg-primary-500" />
        )}
      </span>
      <span className="text-sm">{label}</span>
    </label>
  );
}

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
    <aside className={cn("flex flex-col gap-6", className)}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <Heading size="sm">Фильтры</Heading>
        {activeCount > 0 && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-sm text-primary-500"
          >
            Сбросить
            <span className="flex size-5 items-center justify-center rounded-full bg-secondary-500 text-xs font-medium text-white">
              {activeCount}
            </span>
          </button>
        )}
      </div>

      {/* Filter groups */}
      {filterGroups.map((group) => (
        <div key={group.title} className="flex flex-col gap-3">
          <Text className="font-medium">{group.title}</Text>
          <div className="flex flex-col gap-2.5">
            {group.options.map((option) => (
              <CheckboxItem
                key={option.value}
                label={option.label}
                count={option.count}
                checked={selectedFilters[group.title]?.has(option.value) ?? false}
                onChange={() => toggleFilter(group.title, option.value)}
              />
            ))}
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
            className="h-10 w-full rounded-xl border border-border-default px-3 text-sm
              outline-none placeholder:text-input-placeholder focus:border-primary-500"
          />
          <span className="shrink-0 text-disabled">—</span>
          <input
            type="text"
            placeholder={`до ${priceRange.max.toLocaleString("ru-RU")}`}
            className="h-10 w-full rounded-xl border border-border-default px-3 text-sm
              outline-none placeholder:text-input-placeholder focus:border-primary-500"
          />
        </div>
      </div>

      {/* Availability */}
      <div className="flex flex-col gap-3">
        <Text className="font-medium">{availabilityGroup.title}</Text>
        <div className="flex flex-col gap-2.5">
          {availabilityGroup.options.map((option) => (
            <RadioItem
              key={option.value}
              label={option.label}
              checked={selectedAvailability === option.value}
              onChange={() => setSelectedAvailability(option.value)}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
