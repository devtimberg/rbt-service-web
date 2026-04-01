"use client";

import { useState } from "react";
import {
  Breadcrumb,
  Button,
  Chip,
  Container,
  Heading,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/ui/kit";
import { useStickyScroll } from "@/shared/lib/use-sticky-scroll";
import { Footer } from "@/widgets/footer";
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
  const { ref: filtersRef, top: filtersTop } = useStickyScroll<HTMLDivElement>();

  return (
    <>
      <Container>
        <Breadcrumb items={BREADCRUMB_ITEMS} />
      </Container>

      <Container className="mt-6">
        <div className="flex gap-8">
          {/* Filters sidebar — desktop only */}
          <div
            ref={filtersRef}
            className="hidden shrink-0 self-start lg:block"
            style={{ position: "sticky", top: filtersTop }}
          >
            <CatalogFilters
              filterGroups={MOCK_FILTER_GROUPS}
              availabilityGroup={MOCK_AVAILABILITY_OPTIONS}
              priceRange={MOCK_PRICE_RANGE}
            />
          </div>

          {/* Main content */}
          <div className="flex-1">
            <Heading size="lg">Запчасти для холодильников</Heading>

            {/* Sort chips */}
            <div className="-mx-4 mt-4 flex items-center gap-3 overflow-x-auto px-4 scrollbar-none">
              <span className="hidden shrink-0 text-sm text-tertiary sm:inline">Сортировка:</span>
              {SORT_OPTIONS.map((option) => (
                <Chip
                  key={option.value}
                  variant="outline-default"
                  size="sm"
                  rounded="md"
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

            {/* Show more */}
            <div className="mt-12 flex justify-center">
              <Button variant="secondary" rounded="full" className="px-10">
                Показать ещё
              </Button>
            </div>

            {/* Pagination */}
            <Pagination className="mt-10">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">12</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </Container>

      <div className="mt-20">
        <Footer variant="default" />
      </div>
    </>
  );
}
