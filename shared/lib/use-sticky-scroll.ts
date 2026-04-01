"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Хук для двунаправленного sticky-поведения:
 * — при скролле вниз элемент прокручивается до тех пор, пока его низ
 *   не достигнет низа viewport, затем фиксируется
 * — при скролле вверх элемент прокручивается до тех пор, пока его верх
 *   не достигнет верха viewport, затем фиксируется
 */
export function useStickyScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const topRef = useRef(0);
  const lastScrollTopRef = useRef(0);
  const [top, setTop] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const scrollParent = findScrollParent(el);
    if (!scrollParent) return;

    lastScrollTopRef.current = scrollParent.scrollTop;

    const onScroll = () => {
      const scrollTop = scrollParent.scrollTop;
      const delta = scrollTop - lastScrollTopRef.current;
      lastScrollTopRef.current = scrollTop;

      const sidebarHeight = el.offsetHeight;
      const viewportHeight = scrollParent.clientHeight;

      if (sidebarHeight <= viewportHeight) {
        topRef.current = 0;
      } else {
        const minTop = viewportHeight - sidebarHeight;
        topRef.current = Math.max(
          minTop,
          Math.min(0, topRef.current - delta),
        );
      }

      setTop(topRef.current);
    };

    scrollParent.addEventListener("scroll", onScroll, { passive: true });
    return () => scrollParent.removeEventListener("scroll", onScroll);
  }, []);

  return { ref, top };
}

function findScrollParent(node: HTMLElement): HTMLElement | null {
  let parent = node.parentElement;
  while (parent) {
    const { overflowY } = getComputedStyle(parent);
    if (overflowY === "auto" || overflowY === "scroll") return parent;
    parent = parent.parentElement;
  }
  return null;
}
