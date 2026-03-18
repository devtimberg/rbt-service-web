"use client";

import * as React from "react";

import { SearchIcon } from "@/shared/icons";
import { cn } from "@/shared/lib/utils";

type SearchInputProps = Omit<React.ComponentProps<"input">, "size"> & {
  rootClassName?: string;
  buttonClassName?: string;
  buttonAriaLabel?: string;
  onSearch?: (value: string) => void;
};

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      rootClassName,
      buttonClassName,
      buttonAriaLabel = "Поиск",
      onSearch,
      placeholder = "Введите название, артикул или модель детали",
      disabled,
      ...props
    },
    ref,
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    const setInputRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;

        if (typeof ref === "function") {
          ref(node);
          return;
        }

        if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    const handleSubmit = React.useCallback(
      (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!onSearch || disabled) return;

        const value = inputRef.current?.value?.trim() ?? "";
        onSearch(value);
      },
      [disabled, onSearch],
    );

    return (
      <form
        role="search"
        onSubmit={handleSubmit}
        className={cn(
          "flex h-[74px] w-full items-center rounded-[24px] bg-white px-4 py-2 md:max-w-[740px]",
          rootClassName,
        )}
      >
        <input
          ref={setInputRef}
          data-slot="search-input"
          className={cn(
            "text-primary-900 placeholder:text-input-placeholder h-full min-w-0 flex-1 bg-transparent pr-4 pl-3 text-[18px] leading-none outline-none",
            className,
          )}
          placeholder={placeholder}
          autoComplete="off"
          autoFocus
          disabled={disabled}
          {...props}
        />

        <button
          type="submit"
          aria-label={buttonAriaLabel}
          disabled={disabled}
          className={cn(
            "bg-primary-500 inline-flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-[16px] text-white shadow-[0_0_19px_7px_rgba(0,64,183,0.16)] transition-all duration-200 ease-out hover:scale-[1.04] hover:shadow-[0_0_24px_9px_rgba(0,64,183,0.24)] focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60",
            buttonClassName,
          )}
        >
          <SearchIcon
            className="size-7"
            aria-hidden
          />
        </button>
      </form>
    );
  },
);

SearchInput.displayName = "SearchInput";
