"use client";

import { Container } from "@/shared/ui/kit";
import { CatalogSearch } from "@/widgets/catalog-search";
import { HomeBenefitsStrip } from "./home-benefits-strip";
import { HomeQuickAction } from "./home-quick-action";
import { Footer } from "@/widgets";

export function HomePage() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="my-0 w-full px-4 py-[clamp(8px,2vh,36px)] lg:my-auto lg:px-0 [@media(max-height:760px)]:py-1 [@media(max-height:860px)]:py-2">
        <Container className="mt-[clamp(88px,6vh,56px)] flex justify-center lg:mt-0">
          <CatalogSearch />
        </Container>
        <div className="mt-[clamp(28px,7.5vh,144px)] max-[1200px]:mt-12 [@media(max-height:760px)]:mt-10 [@media(max-height:860px)]:mt-10">
          <HomeQuickAction />
        </div>
        <div className="mt-[clamp(40px,11vh,200px)] [@media(max-height:760px)]:mt-5 [@media(max-height:860px)]:mt-8">
          <HomeBenefitsStrip />
        </div>
      </div>
      <div className="shrink-0 pb-[calc(env(safe-area-inset-bottom)+76px)] sm:pb-0">
        <Footer />
      </div>
    </div>
  );
}
