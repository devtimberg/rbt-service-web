"use client";

import { Dialog as SheetPrimitive } from "radix-ui";

import { Button } from "./button";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Удалить",
  cancelLabel = "Отмена",
  onConfirm,
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <SheetPrimitive.Root
      open={open}
      onOpenChange={onOpenChange}
    >
      <SheetPrimitive.Portal>
        <SheetPrimitive.Overlay
          className="fixed inset-0 z-[9999] bg-black/20 animate-in fade-in-0
            duration-200"
        />
        <SheetPrimitive.Content
          className="fixed z-[9999] bg-white p-6 shadow-xl
            max-sm:inset-x-0 max-sm:bottom-0 max-sm:rounded-t-2xl
            max-sm:animate-in max-sm:slide-in-from-bottom max-sm:duration-300
            sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2
            sm:rounded-2xl sm:w-full sm:max-w-sm
            sm:animate-in sm:fade-in-0 sm:zoom-in-95 sm:duration-200"
        >
          <SheetPrimitive.Title className="text-lg font-semibold">
            {title}
          </SheetPrimitive.Title>

          {description && (
            <SheetPrimitive.Description className="text-tertiary mt-2 text-sm">
              {description}
            </SheetPrimitive.Description>
          )}

          <div
            className="mt-6 flex flex-col-reverse gap-3 sm:flex-row
              sm:justify-end"
          >
            <Button
              variant="secondary"
              size="md"
              rounded="default"
              onClick={() => onOpenChange(false)}
              className="sm:w-auto sm:h-9 sm:px-3 sm:text-sm"
            >
              {cancelLabel}
            </Button>
            <Button
              variant="primary"
              size="md"
              rounded="default"
              onClick={handleConfirm}
              className="sm:w-auto sm:h-9 sm:px-3 sm:text-sm"
            >
              {confirmLabel}
            </Button>
          </div>
        </SheetPrimitive.Content>
      </SheetPrimitive.Portal>
    </SheetPrimitive.Root>
  );
}
