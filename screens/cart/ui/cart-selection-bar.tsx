"use client";

import { DeleteIcon } from "@/shared/icons";
import { Checkbox, Text } from "@/shared/ui/kit";
import { Share2 } from "lucide-react";

type CartSelectionBarProps = {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onDeleteSelected: () => void;
  onShareSelected: () => void;
};

export function CartSelectionBar({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onDeleteSelected,
  onShareSelected,
}: CartSelectionBarProps) {
  const allSelected = selectedCount === totalCount;
  const someSelected = selectedCount > 0 && !allSelected;

  const checked = allSelected
    ? true
    : someSelected
      ? "indeterminate"
      : false;

  return (
    <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
      {/* Left: select all */}
      <label className="flex cursor-pointer items-center gap-3">
        <Checkbox
          checked={checked}
          onCheckedChange={() => (allSelected ? onDeselectAll() : onSelectAll())}
        />
        <Text size="sm" className="font-medium">
          Выбрать все
        </Text>
      </label>

      {/* Right: share + delete */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onShareSelected}
          disabled={selectedCount === 0}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2
            text-sm font-medium text-tertiary transition-colors hover:bg-gray-50
            disabled:cursor-default disabled:opacity-40"
        >
          <Share2 className="size-4" />
          <span className="hidden sm:inline">Поделиться</span>
        </button>
        <button
          type="button"
          onClick={onDeleteSelected}
          disabled={selectedCount === 0}
          className="flex size-9 cursor-pointer items-center justify-center rounded-lg
            text-disabled transition-colors hover:text-danger-500
            disabled:cursor-default disabled:opacity-40"
        >
          <DeleteIcon className="size-5" />
        </button>
      </div>
    </div>
  );
}
