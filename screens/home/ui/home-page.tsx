"use client";

import { Container } from "@/shared/ui/kit";
import { CatalogSearch } from "@/widgets/catalog-search";
import { HomeBenefitsStrip } from "./home-benefits-strip";
import { HomeQuickAction } from "./home-quick-action";
import { Footer } from "@/widgets";

export function HomePage() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div
        className="flex flex-1 flex-col justify-center px-4
          py-[clamp(8px,2vh,36px)] lg:px-0
          [@media(max-height:760px)]:py-1
          [@media(max-height:860px)]:py-2"
      >
        <div
          className="mx-auto flex w-full flex-col
            gap-[clamp(28px,7.5vh,144px)]
            sm:gap-[clamp(24px,5vh,80px)]
            [@media(min-height:900px)]:gap-[clamp(80px,8vh,160px)]"
        >
          {/* Mobile: search in content */}
          <Container className="flex justify-center sm:hidden">
            <CatalogSearch expanded />
          </Container>
          {/* Desktop: spacer for header search that translates down */}
          <div
            className="hidden h-18.5 sm:[@media(min-height:700px)]:block"
            aria-hidden="true"
          />
          <div>
            <HomeQuickAction />
          </div>
          <div>
            <HomeBenefitsStrip />
          </div>
        </div>
      </div>
      <div
        className="mt-auto shrink-0 pb-[calc(env(safe-area-inset-bottom)+76px)]
          sm:pb-0"
      >
        <Footer />
      </div>
    </div>
  );
}
