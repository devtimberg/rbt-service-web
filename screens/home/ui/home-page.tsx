"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/utils";
import { Container } from "@/shared/ui/kit";
import { CatalogSearch } from "@/widgets/catalog-search";
import { Header } from "@/widgets/header";
import { HomeBenefitsStrip } from "./home-benefits-strip";
import { HomeQuickAction } from "./home-quick-action";
import { Footer } from "@/widgets";

export function HomePage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasVerticalScroll, setHasVerticalScroll] = useState(false);

  useEffect(() => {
    const viewport = scrollRef.current;
    if (!viewport) return;

    const content = viewport.firstElementChild as HTMLElement | null;

    const checkOverflow = () => {
      setHasVerticalScroll(viewport.scrollHeight > viewport.clientHeight + 1);
    };

    checkOverflow();

    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(viewport);
    if (content) resizeObserver.observe(content);

    window.addEventListener("resize", checkOverflow);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", checkOverflow);
    };
  }, []);

  return (
    <div className="bg-primary-500 flex h-dvh flex-col rounded-none lg:h-[calc(100dvh-32px)] lg:rounded-[40px]">
      <div className={cn("shrink-0", hasVerticalScroll && "border-b border-primary-300")}>
        <Header />
      </div>
      <div
        ref={scrollRef}
        className="flex min-h-0 flex-1 flex-col overflow-y-auto"
      >
        <div className="my-auto w-full py-[clamp(8px,2vh,36px)] [@media(max-height:860px)]:py-2 [@media(max-height:760px)]:py-1">
          <Container className="flex justify-center">
            <CatalogSearch />
          </Container>
          <div className="mt-[clamp(28px,7.5vh,144px)] [@media(max-height:860px)]:mt-6 [@media(max-height:760px)]:mt-4">
            <HomeQuickAction />
          </div>
          <div className="mt-[clamp(40px,11vh,200px)] [@media(max-height:860px)]:mt-8 [@media(max-height:760px)]:mt-5">
            <HomeBenefitsStrip />
          </div>
        </div>
      </div>
      <div className={cn("shrink-0", hasVerticalScroll && "border-t border-primary-300")}>
        <Footer />
      </div>
    </div>
  );
}
