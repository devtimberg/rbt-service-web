import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { HomeIcon } from "@/shared/icons";
import { ROUTES } from "@/shared/lib/routes";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "text-primary-100 flex items-center gap-1.5 text-sm",
        className,
      )}
    >
      <Link
        href={ROUTES.HOME}
        className="hover:text-primary-500"
      >
        <HomeIcon className="size-4" />
      </Link>

      {items.map((item, index) => (
        <span
          key={index}
          className="flex items-center gap-1.5"
        >
          <span>—</span>
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-primary-500"
            >
              {item.label}
            </Link>
          ) : (
            <span>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
