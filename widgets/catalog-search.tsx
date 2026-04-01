"use client";

import { SearchOutlineIcon } from "@/shared/icons";
import { cn } from "@/shared/lib/utils";
import Link from "next/link";
import { createPortal } from "react-dom";
import * as React from "react";

type Part = {
  id: string;
  name: string;
  article: string;
  price: number;
};

const FAKE_PARTS: Part[] = [
  { id: "1", name: "Компрессор холодильника Атлант", article: "КМ-120", price: 8500 },
  { id: "2", name: "Компрессор инверторный Samsung", article: "DA97-15270A", price: 12400 },
  { id: "3", name: "Термостат холодильника ТАМ-133", article: "ТАМ-133-1М", price: 650 },
  { id: "4", name: "Термостат K59-L1275 Ranco", article: "K59-L1275", price: 890 },
  { id: "5", name: "Мотор вентилятора No Frost", article: "DG8-3J", price: 1200 },
  { id: "6", name: "Модуль управления Indesit", article: "C00293259", price: 4300 },
  { id: "7", name: "Модуль управления Bosch", article: "BSH-649559", price: 6800 },
  { id: "8", name: "Уплотнитель двери Stinol 101", article: "С00854017", price: 1100 },
  { id: "9", name: "Уплотнитель двери Атлант МХМ", article: "769748901509", price: 980 },
  { id: "10", name: "ТЭН оттайки Samsung", article: "DA47-00263F", price: 1450 },
  { id: "11", name: "ТЭН оттайки LG", article: "5300JB1092B", price: 1350 },
  { id: "12", name: "Датчик температуры NTC Samsung", article: "DA32-10105Q", price: 490 },
  { id: "13", name: "Пусковое реле компрессора", article: "РКТ-3", price: 320 },
  { id: "14", name: "Лампа холодильника LED E14 3W", article: "LED-E14-3W", price: 250 },
  { id: "15", name: "Вентилятор морозильной камеры LG", article: "4680JB1026B", price: 1600 },
  { id: "16", name: "Клапан электромагнитный двойной", article: "КЭМ-2", price: 2100 },
  { id: "17", name: "Петля двери холодильника Bosch", article: "BSH-268698", price: 780 },
  { id: "18", name: "Ручка двери холодильника Атлант", article: "775373400201", price: 450 },
  { id: "19", name: "Фильтр-осушитель 15г", article: "DCL-083S", price: 280 },
  { id: "20", name: "Плата дисплея холодильника Samsung", article: "DA41-00484A", price: 3700 },
];

function searchParts(query: string): Part[] {
  const q = query.toLowerCase();
  return FAKE_PARTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.article.toLowerCase().includes(q),
  ).slice(0, 6);
}

function formatPrice(price: number): string {
  return price.toLocaleString("ru-RU") + " ₽";
}

type CatalogSearchProps = {
  expanded?: boolean;
};

export function CatalogSearch({ expanded = false }: CatalogSearchProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [query, setQuery] = React.useState("");
  const [focused, setFocused] = React.useState(false);

  const [dropdownStyle, setDropdownStyle] = React.useState<React.CSSProperties>({});
  const results = query.length >= 2 ? searchParts(query) : [];
  const showDropdown = focused && results.length > 0;

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    if (showDropdown && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: "fixed",
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
      });
    }
  }, [showDropdown, query]);

  const handleSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    },
    [],
  );

  const dropdown = showDropdown &&
    createPortal(
      <div
        className="z-50 overflow-hidden rounded-lg bg-white shadow-xl"
        style={dropdownStyle}
      >
        {results.map((part) => (
          <button
            key={part.id}
            type="button"
            className="flex w-full items-center justify-between gap-4 px-5 py-3
              text-left transition-colors hover:bg-gray-50"
            onClick={() => {
              setQuery(part.name);
              setFocused(false);
            }}
          >
            <div className="min-w-0 flex-1">
              <p className="text-primary-900 truncate text-sm font-medium">
                {part.name}
              </p>
              <p className="text-xs text-gray-400">{part.article}</p>
            </div>
            <span className="text-primary-500 shrink-0 text-sm font-semibold">
              {formatPrice(part.price)}
            </span>
          </button>
        ))}
      </div>,
      document.body,
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

      {/* Desktop: search form with autocomplete */}
      <div
        ref={wrapperRef}
        className={cn(
          "hidden w-full transition-all duration-500 ease-in-out sm:block",
          expanded ? "max-w-185" : "max-w-110",
        )}
      >
        <form
          role="search"
          onSubmit={handleSubmit}
          className={cn(
            `flex w-full items-center gap-3 bg-white transition-all
            duration-500 ease-in-out`,
            expanded
              ? "h-18.5 rounded-[24px] px-5 py-2"
              : "h-10 rounded-lg px-4 py-2",
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
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setFocused(true);
            }}
            onFocus={() => setFocused(true)}
            className={cn(
              `text-primary-900 placeholder:text-input-placeholder min-w-0
              flex-1 bg-transparent leading-none outline-none transition-all
              duration-500`,
              expanded ? "text-[18px]" : "text-sm",
            )}
            placeholder="Поиск запчастей по артикулу или названию..."
            autoComplete="off"
          />
        </form>
        {dropdown}
      </div>
    </>
  );
}
