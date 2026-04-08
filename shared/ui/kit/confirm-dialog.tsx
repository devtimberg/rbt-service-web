"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setContainer(document.getElementById("portal-root"));
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  if (!open || !container) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        className="absolute inset-0 bg-black/20 animate-in fade-in-0
          duration-200"
        onClick={() => onOpenChange(false)}
      />

      <div
        ref={contentRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby={description ? "confirm-desc" : undefined}
        className="absolute bg-white p-6 shadow-xl
          max-sm:inset-x-0 max-sm:bottom-0 max-sm:rounded-t-2xl
          max-sm:animate-in max-sm:slide-in-from-bottom max-sm:duration-300
          sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2
          sm:rounded-2xl sm:w-full sm:max-w-sm
          sm:animate-in sm:fade-in-0 sm:zoom-in-95 sm:duration-200"
      >
        <h2
          id="confirm-title"
          className="text-lg font-semibold"
        >
          {title}
        </h2>

        {description && (
          <p
            id="confirm-desc"
            className="text-tertiary mt-2 text-sm"
          >
            {description}
          </p>
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
      </div>
    </div>,
    container,
  );
}
