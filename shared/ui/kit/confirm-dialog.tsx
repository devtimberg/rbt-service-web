"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
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
    <DialogPrimitive.Root
      open={open}
      onOpenChange={onOpenChange}
      modal={false}
    >
      <DialogPrimitive.Portal>
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <div
          className="fixed inset-0 z-[100] bg-black/20 animate-in fade-in-0
            duration-200"
          onClick={() => onOpenChange(false)}
        />

        <DialogPrimitive.Content
          onOpenAutoFocus={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          className="fixed z-[100] outline-none bg-white p-6 shadow-xl
            max-sm:inset-x-0 max-sm:bottom-0 max-sm:rounded-t-2xl
            sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2
            sm:rounded-2xl sm:w-full sm:max-w-sm
            data-[state=open]:animate-in data-[state=closed]:animate-out
            max-sm:data-[state=open]:slide-in-from-bottom
            max-sm:data-[state=closed]:slide-out-to-bottom
            sm:data-[state=open]:fade-in-0 sm:data-[state=open]:zoom-in-95
            sm:data-[state=closed]:fade-out-0 sm:data-[state=closed]:zoom-out-95
            data-[state=open]:duration-300 data-[state=closed]:duration-200"
        >
          <DialogPrimitive.Title className="text-lg font-semibold">
            {title}
          </DialogPrimitive.Title>

          {description && (
            <DialogPrimitive.Description className="text-tertiary mt-2 text-sm">
              {description}
            </DialogPrimitive.Description>
          )}

          <div
            className="mt-6 flex flex-col-reverse gap-3 sm:flex-row
              sm:justify-end"
          >
            <Button
              variant="secondary"
              size="sm"
              rounded="default"
              onClick={() => onOpenChange(false)}
              className="sm:w-auto"
            >
              {cancelLabel}
            </Button>
            <Button
              variant="primary"
              size="sm"
              rounded="default"
              onClick={handleConfirm}
              className="sm:w-auto"
            >
              {confirmLabel}
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
