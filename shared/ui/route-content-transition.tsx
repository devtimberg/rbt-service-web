"use client";

import { ROUTES } from "@/shared/lib/routes";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";

type TransitionMode = "from-home" | "to-home" | "none";

const routeLayerTransition = (mode: TransitionMode) => {
  if (mode === "from-home") {
    return { type: "spring", stiffness: 360, damping: 38, mass: 0.85 } as const;
  }

  if (mode === "to-home") {
    return { type: "tween", duration: 0.34, ease: [0.22, 1, 0.36, 1] } as const;
  }

  return { duration: 0 } as const;
};

export function RouteContentTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [previousPathname, setPreviousPathname] = useState(pathname);

  const isCurrentHome = pathname === ROUTES.HOME;
  const isPreviousHome = previousPathname === ROUTES.HOME;
  const routeGroupKey = isCurrentHome ? "home" : "inner";

  const transitionMode = useMemo<TransitionMode>(() => {
    if (isPreviousHome && !isCurrentHome) {
      return "from-home";
    }
    if (!isPreviousHome && isCurrentHome) {
      return "to-home";
    }
    return "none";
  }, [isCurrentHome, isPreviousHome]);

  const finalizeTransition = () => {
    setPreviousPathname(pathname);
  };

  const layerClassName =
    transitionMode === "none"
      ? "relative h-full w-full"
      : isCurrentHome
        ? "absolute inset-0 z-10 h-full w-full"
        : "absolute inset-0 z-20 h-full w-full";

  return (
    <div className="relative flex-1 overflow-visible sm:min-h-0 sm:overflow-hidden">
      <AnimatePresence
        initial={false}
        mode="sync"
        custom={transitionMode}
        onExitComplete={finalizeTransition}
      >
        <motion.div
          key={routeGroupKey}
          custom={transitionMode}
          className={layerClassName}
          initial={(mode: TransitionMode) =>
            mode === "from-home" ? { y: "100%" } : { y: 0 }
          }
          animate={{ y: 0 }}
          exit={(mode: TransitionMode) =>
            mode === "to-home" ? { y: "100%" } : { y: 0 }
          }
          transition={routeLayerTransition(transitionMode)}
        >
          <div className="h-full">{children}</div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
