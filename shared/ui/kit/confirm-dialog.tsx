"use client";

import { useEffect, useState } from "react";
import { AlertDialog } from "radix-ui";
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

function usePortalContainer() {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setContainer(document.getElementById("portal-root"));
  }, []);
  return container;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Удалить",
  cancelLabel = "Отмена",
  onConfirm,
}: ConfirmDialogProps) {
  const portalContainer = usePortalContainer();

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog.Root
      open={open}
      onOpenChange={onOpenChange}
    >
      <AlertDialog.Portal container={portalContainer}>
        <AlertDialog.Overlay
          className="fixed inset-0 z-[9999] bg-black/20
            data-[state=open]:animate-in data-[state=open]:fade-in-0
            data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
        />

        <AlertDialog.Content
          className="fixed z-[9999] bg-white p-6 shadow-xl outline-none
            max-sm:inset-x-0 max-sm:bottom-0 max-sm:rounded-t-2xl
            max-sm:data-[state=open]:animate-in
            max-sm:data-[state=open]:slide-in-from-bottom
            max-sm:data-[state=open]:duration-300
            max-sm:data-[state=closed]:animate-out
            max-sm:data-[state=closed]:slide-out-to-bottom
            max-sm:data-[state=closed]:duration-200
            sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2
            sm:rounded-2xl sm:w-full sm:max-w-sm
            sm:data-[state=open]:animate-in sm:data-[state=open]:fade-in-0
            sm:data-[state=open]:zoom-in-95 sm:data-[state=open]:duration-200
            sm:data-[state=closed]:animate-out sm:data-[state=closed]:fade-out-0
            sm:data-[state=closed]:zoom-out-95 sm:data-[state=closed]:duration-200"
        >
          <AlertDialog.Title className="text-lg font-semibold">
            {title}
          </AlertDialog.Title>

          {description && (
            <AlertDialog.Description className="text-tertiary mt-2 text-sm">
              {description}
            </AlertDialog.Description>
          )}

          <div
            className="mt-6 flex flex-col-reverse gap-3 sm:flex-row
              sm:justify-end"
          >
            <AlertDialog.Cancel asChild>
              <Button
                variant="secondary"
                size="md"
                rounded="default"
                className="sm:w-auto sm:h-9 sm:px-3 sm:text-sm"
              >
                {cancelLabel}
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button
                variant="primary"
                size="md"
                rounded="default"
                onClick={handleConfirm}
                className="sm:w-auto sm:h-9 sm:px-3 sm:text-sm"
              >
                {confirmLabel}
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
