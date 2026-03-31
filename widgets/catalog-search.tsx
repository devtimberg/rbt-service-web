"use client";

import * as React from "react";
import Link from "next/link";
import { SearchIcon } from "@/shared/icons";
import { cn } from "@/shared/lib/utils";

export function CatalogSearch() {
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
      <Link
        href="/search"
        aria-label="Поиск запчастей"
        className="flex h-18.5 w-full items-center gap-3 rounded-[24px] bg-white
          px-5 py-2 outline-none [-webkit-tap-highlight-color:transparent]
          focus:outline-none focus-visible:outline-none md:hidden"
      >
        <SearchIcon
          className="text-input-placeholder size-6 shrink-0"
          aria-hidden
        />
        <span
          className="text-input-placeholder h-full min-w-0 flex-1 content-center
            text-[18px] leading-none"
        >
          Поиск запчастей
        </span>
      </Link>

      <form
        role="search"
        onSubmit={handleSubmit}
        className="hidden h-18.5 w-full items-center gap-3 rounded-[24px]
          bg-white px-5 py-2 md:flex md:max-w-185 md:justify-self-center"
      >
        <SearchIcon
          className="text-input-placeholder size-6 shrink-0"
          aria-hidden
        />
        <input
          ref={inputRef}
          data-slot="search-input"
          className={cn(
            `text-primary-900 placeholder:text-input-placeholder h-full min-w-0
            flex-1 bg-transparent text-[18px] leading-none outline-none`,
          )}
          placeholder="Введите название, артикул или модель детали"
          autoComplete="off"
          autoFocus
        />
      </form>
    </>
  );
}
