"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import { ROUTES } from "@/shared/lib/route-paths";

/** Ротация refresh-токена провалилась (отозван, истёк, переиспользован) —
 * кука с мёртвыми токенами остаётся, поэтому выходим явно. */
function SessionErrorBoundary() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshFailed") {
      void signOut({ redirectTo: ROUTES.LOGIN });
    }
  }, [session?.error]);

  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <SessionErrorBoundary />
      {children}
    </SessionProvider>
  );
}
