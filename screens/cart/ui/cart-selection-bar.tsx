"use client";

import { DeleteIcon, ShareIcon } from "@/shared/icons";
import { Button, Checkbox, IconButton, Text } from "@/shared/ui/kit";

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

  const checked = allSelected ? true : someSelected ? "indeterminate" : false;

  return (
    <div
      className="flex items-center justify-between rounded-2xl bg-white px-4
        py-3"
    >
      {/* Left: select all */}
      <label className="flex cursor-pointer items-center gap-3">
        <Checkbox
          checked={checked}
          onCheckedChange={() =>
            allSelected ? onDeselectAll() : onSelectAll()
          }
        />
        <Text
          size="sm"
          className="font-medium"
        >
          Выбрать все
        </Text>
      </label>

      {/* Right: share + delete */}
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          icon={<ShareIcon className="size-5" />}
          onClick={onShareSelected}
          disabled={selectedCount === 0}
          className="text-tertiary gap-1.5 font-medium disabled:cursor-default
            disabled:opacity-40"
        >
          Поделиться
        </Button>
        <IconButton
          variant="default"
          size="md"
          icon={DeleteIcon}
          iconSize={20}
          onClick={onDeleteSelected}
          disabled={selectedCount === 0}
          className="shrink-0 rounded-lg disabled:cursor-default
            disabled:opacity-40"
        />
      </div>
    </div>
  );
}
