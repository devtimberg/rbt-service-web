"use client";

import { CATALOG_CATEGORIES } from "@/screens/catalog/model";
import { useSearchStore } from "@/shared/lib/stores";
import { Skeleton } from "@/shared/ui/kit";
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

const ALL_CATEGORIES = CATALOG_CATEGORIES.flatMap((group) => group.items);

function searchCategories(query: string): string[] {
  const q = query.toLowerCase();
  return ALL_CATEGORIES.filter((c) => c.toLowerCase().includes(q));
}

function searchParts(query: string): Part[] {
  const q = query.toLowerCase();
  return FAKE_PARTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) || p.article.toLowerCase().includes(q),
  ).slice(0, 6);
}

function formatPrice(price: number): string {
  return price.toLocaleString("ru-RU") + " ₽";
}

const FAKE_DELAY = 600;

export function SearchPage() {
  const query = useSearchStore((s) => s.query);
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<Part[]>([]);
  const [categories, setCategories] = React.useState<string[]>([]);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout>>(null);

  const hasQuery = query.length >= 2;

  React.useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.length < 2) {
      setResults([]);
      setCategories([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(() => {
      setCategories(searchCategories(query));
      setResults(searchParts(query));
      setLoading(false);
    }, FAKE_DELAY);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return (
    <div className="flex grow flex-col">
      {loading && hasQuery && (
        <div className="flex flex-col gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 px-2 py-3"
            >
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-2.5 w-1/3" />
              </div>
              <Skeleton className="h-3.5 w-16 shrink-0" />
            </div>
          ))}
        </div>
      )}

      {!loading && hasQuery && categories.length > 0 && (
        <div className="flex flex-col">
          <p className="px-2 pt-3 pb-1 text-xs font-medium text-gray-400">
            Категории
          </p>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className="flex w-full items-center justify-between gap-4 px-2
                py-3 text-left transition-colors active:bg-gray-50"
            >
              <p className="text-primary-900 truncate text-sm font-medium">
                {category}
              </p>
              <svg
                className="size-4 shrink-0 text-gray-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          ))}
        </div>
      )}

      {!loading && hasQuery && results.length > 0 && (
        <div className="flex flex-col">
          <p className="px-2 pt-3 pb-1 text-xs font-medium text-gray-400">
            Запчасти
          </p>
          {results.map((part) => (
            <button
              key={part.id}
              type="button"
              className="flex w-full items-center justify-between gap-4 px-2
                py-3 text-left transition-colors active:bg-gray-50"
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
        </div>
      )}

      {!loading && hasQuery && results.length === 0 && categories.length === 0 && (
        <div className="py-10 text-center text-sm text-gray-400">
          Ничего не найдено
        </div>
      )}

      {!hasQuery && (
        <div className="py-10 text-center text-sm text-gray-400">
          Введите название или артикул запчасти
        </div>
      )}
    </div>
  );
}
