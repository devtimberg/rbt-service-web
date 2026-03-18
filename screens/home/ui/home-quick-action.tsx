import Link from "next/link";
import { HOME_QUICK_ACTIONS } from "@/screens/home/model/quick-action";
import { Container, Box } from "@/shared/ui/kit";
import { cn } from "@/shared/lib/utils";

export function HomeQuickAction() {
  return (
    <Container>
      <Box className="m-auto max-w-240">
        <div className="grid grid-cols-3 gap-3 md:grid-cols-3 md:gap-6 lg:gap-8">
          {HOME_QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            const isAccent =
              action.colorVariant === "accent" || action.isAccent;

            return (
              <Link
                key={action.key}
                href={action.href}
                className={cn(
                  `text-inverse bg-primary-300 flex w-full flex-col items-center
                  justify-center gap-3 rounded-3xl px-3 py-4 text-center
                  transition-colors md:flex-row md:justify-start md:rounded-2xl
                  md:px-4 md:py-3 md:text-left`,
                  isAccent ? "bg-secondary-500" : "null",
                )}
              >
                <span
                  className="inline-flex h-14 w-14 shrink-0 items-center
                    justify-center rounded-2xl border border-white/25
                    bg-white/10 md:rounded-xl"
                >
                  <Icon
                    className="size-8 md:size-10"
                    aria-hidden
                  />
                </span>
                <span
                  className="text-[14px] leading-4 font-semibold
                    whitespace-pre-line md:text-lg md:leading-5"
                >
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
