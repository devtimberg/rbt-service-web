import Link from "next/link";
import { HOME_QUICK_ACTIONS } from "@/screens/home/model/quick-action";
import { Container, Box } from "@/shared/ui/kit";
import { cn } from "@/shared/lib/utils";

export function HomeQuickAction() {
  return (
    <Container>
      <Box className="m-auto max-w-[960px]">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {HOME_QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            const isAccent =
              action.colorVariant === "accent" || action.isAccent;

            return (
              <Link
                key={action.key}
                href={action.href}
                className={cn(
                  "text-inverse bg-primary-300 flex w-full items-center gap-3 rounded-2xl px-4 py-3 transition-colors",
                  isAccent ? "bg-secondary-500" : "null",
                )}
              >
                <span className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-white/25 bg-white/10">
                  <Icon
                    className="size-10"
                    aria-hidden
                  />
                </span>
                <span className="text-lg leading-5 font-semibold whitespace-pre-line">
                  {action.text}
                </span>
              </Link>
            );
          })}
        </div>
      </Box>
    </Container>
  );
}
