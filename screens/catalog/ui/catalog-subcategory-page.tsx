"use client";

import { useState } from "react";
import { Breadcrumb, Chip, Container, Heading } from "@/shared/ui/kit";
import {
  MOCK_PRODUCTS,
  MOCK_FILTER_GROUPS,
  MOCK_AVAILABILITY_OPTIONS,
  MOCK_PRICE_RANGE,
} from "../model";
import { ProductCard } from "./product-card";
import { CatalogFilters } from "./catalog-filters";

const SORT_OPTIONS = [
  { label: "По популярности", value: "popular" },
  { label: "По цене ↑", value: "price-asc" },
  { label: "По цене ↓", value: "price-desc" },
] as const;

const BREADCRUMB_ITEMS = [
  { label: "Каталог", href: "/catalog" },
  { label: "Запасные части для бытовой техники", href: "/catalog" },
  { label: "Запчасти для холодильников" },
];

export function CatalogSubcategoryPage() {
  const [sort, setSort] = useState("popular");

  return (
    <>
      <Container>
        <Breadcrumb items={BREADCRUMB_ITEMS} />
      </Container>

      <Container className="mt-6">
        <div className="flex gap-8">
          {/* Filters sidebar — desktop only */}
          <CatalogFilters
            filterGroups={MOCK_FILTER_GROUPS}
            availabilityGroup={MOCK_AVAILABILITY_OPTIONS}
            priceRange={MOCK_PRICE_RANGE}
            className="hidden w-60 shrink-0 lg:flex"
          />

          {/* Main content */}
          <div className="flex-1">
            <Heading size="lg">Запчасти для холодильников</Heading>

            {/* Sort chips */}
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-tertiary">Сортировка:</span>
              {SORT_OPTIONS.map((option) => (
                <Chip
                  key={option.value}
                  size="sm"
                  selected={sort === option.value}
                  onClick={() => setSort(option.value)}
                >
                  {option.label}
                </Chip>
              ))}
            </div>

            {/* Product grid */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {MOCK_PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
