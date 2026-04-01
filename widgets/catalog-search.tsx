"use client";

import { SearchOutlineIcon } from "@/shared/icons";
import { cn } from "@/shared/lib/utils";
import Link from "next/link";
import * as React from "react";

type CatalogSearchProps = {
  expanded?: boolean;
};

export function CatalogSearch({ expanded = false }: CatalogSearchProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const value = inputRef.current?.value?.trim() ?? "";
      if (value) {
        // TODO: implement search navigation
      }
    },
    [],
  );

  return (
    <>
      {/* Mobile: link to search page */}
      <Link
        href="/search"
        aria-label="Поиск запчастей"
        className={cn(
          `flex w-full items-center gap-3 bg-white outline-none
          [-webkit-tap-highlight-color:transparent] focus:outline-none
          focus-visible:outline-none sm:hidden`,
          expanded
            ? "h-18.5 rounded-[24px] px-5 py-2"
            : "h-10 rounded-lg px-4 py-2",
        )}
      >
        <SearchOutlineIcon
          className={cn(
            "text-input-placeholder shrink-0",
            expanded ? "size-6" : "size-5",
          )}
          aria-hidden
        />
        <span
          className={cn(
            "text-input-placeholder h-full min-w-0 flex-1 content-center leading-none",
            expanded ? "text-[18px]" : "text-sm",
          )}
        >
          Поиск запчастей
        </span>
      </Link>

      {/* Desktop: search form */}
      <form
        role="search"
        onSubmit={handleSubmit}
        className={cn(
          `hidden w-full items-center gap-3 bg-white transition-all
          duration-500 ease-in-out sm:flex`,
          expanded
            ? "h-18.5 max-w-185 justify-self-center rounded-[24px] px-5 py-2"
            : "h-10 max-w-110 rounded-lg px-4 py-2",
        )}
      >
        <SearchOutlineIcon
          className={cn(
            "text-input-placeholder shrink-0 transition-all duration-500",
            expanded ? "size-6" : "size-5",
          )}
          aria-hidden
        />
        <input
          ref={inputRef}
          data-slot="search-input"
          className={cn(
            `text-primary-900 placeholder:text-input-placeholder min-w-0
            flex-1 bg-transparent leading-none outline-none transition-all
            duration-500`,
            expanded ? "text-[18px]" : "text-sm",
          )}
          placeholder={
            expanded
              ? "Введите название, артикул или модель детали"
              : "Поиск запчастей по артикулу или названию..."
          }
          autoComplete="off"
        />
      </form>
    </>
  );
}
