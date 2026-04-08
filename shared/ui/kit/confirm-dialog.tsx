"use client";

import { Dialog as DialogPrimitive } from "radix-ui";

import { useIsMobile } from "@/shared/lib/use-media-query";
import { cn } from "@/shared/lib/utils";

import { Button } from "./button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./sheet";

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
  const isMobile = useIsMobile();

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const actions = (
    <>
      <Button
        variant="primary"
        size="md"
        rounded="default"
        onClick={handleConfirm}
      >
        {confirmLabel}
      </Button>
      <Button
        variant="secondary"
        size="md"
        rounded="default"
        onClick={() => onOpenChange(false)}
      >
        {cancelLabel}
      </Button>
    </>
  );

  if (isMobile) {
    return (
      <Sheet
        open={open}
        onOpenChange={onOpenChange}
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            {description && (
              <SheetDescription>{description}</SheetDescription>
            )}
          </SheetHeader>
          <SheetFooter>{actions}</SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={onOpenChange}
      modal={false}
    >
      <DialogPrimitive.Portal>
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <div
          className="fixed inset-0 z-50 bg-black/20 animate-in fade-in-0"
          onClick={() => onOpenChange(false)}
        />
        <DialogPrimitive.Content
          className={cn(
            `fixed top-1/2 left-1/2 z-50 w-full max-w-sm -translate-x-1/2
            -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl
            data-[state=closed]:animate-out data-[state=closed]:fade-out-0
            data-[state=closed]:zoom-out-95 data-[state=open]:animate-in
            data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95`,
          )}
        >
          <DialogPrimitive.Title className="text-lg font-semibold">
            {title}
          </DialogPrimitive.Title>
          {description && (
            <DialogPrimitive.Description className="text-tertiary mt-2 text-sm">
              {description}
            </DialogPrimitive.Description>
          )}
          <div className="mt-6 flex flex-row justify-end gap-3">{actions}</div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
