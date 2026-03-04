import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import Link, { type LinkProps } from "next/link";
import { Slot } from "radix-ui";

import { cn } from "@/shared/lib/utils";

type IconComponent = React.ElementType<React.SVGProps<SVGSVGElement>>;
type ButtonProps = Omit<React.ComponentProps<"button">, "children">;
type AnchorProps = Omit<React.ComponentProps<"a">, "children" | "href">;
type SharedProps = VariantProps<typeof iconButtonVariants> & {
  asChild?: boolean;
  children?: React.ReactNode;
  icon?: IconComponent | React.ReactElement;
  iconSize?: number;
  counter?: number | null;
};
type IconButtonAsButtonProps = SharedProps & ButtonProps & { href?: never };
type IconButtonAsLinkProps = SharedProps &
  AnchorProps &
  Pick<LinkProps, "href"> & { type?: never; disabled?: never };
type IconButtonProps = IconButtonAsButtonProps | IconButtonAsLinkProps;

const iconButtonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-primary-300 hover:text-accent-foreground dark:hover:bg-accent/50",
      },
      size: {
        xs: "size-6 [&_svg:not([class*='size-'])]:size-3",
        sm: "size-8",
        md: "size-9",
        lg: "size-10",
      },
    },
    defaultVariants: {
      variant: "ghost",
      size: "md",
    },
  },
);

function IconButton({
  className,
  variant = "ghost",
  size = "md",
  asChild = false,
  children,
  icon,
  iconSize = 24,
  counter,
  href,
  style,
  ...props
}: IconButtonProps) {
  const iconElement = icon
    ? React.isValidElement(icon)
      ? icon
      : React.createElement(icon)
    : null;
  const content = children ?? iconElement;
  const mergedStyle = iconSize
    ? ({
        ...(style ?? {}),
        ["--icon-size"]: `${iconSize}px`,
      } as React.CSSProperties)
    : style;

  const sharedClassName = cn(
    iconButtonVariants({ variant, size, className }),
    "relative",
    iconSize && "[&_svg]:h-(--icon-size) [&_svg]:w-(--icon-size)",
  );
  const hasCounter =
    typeof counter === "number" && Number.isFinite(counter) && counter > 0;
  const counterContent = hasCounter ? (counter > 99 ? "99+" : counter) : null;
  const counterSizeClass =
    size === "lg" ? "min-h-5 min-w-5 px-1.5 text-xs" : "min-h-4 min-w-4 px-1 text-[10px]";
  const counterBadge = hasCounter ? (
    <span
      aria-hidden
      className={cn(
        "bg-destructive absolute top-0 right-0 inline-flex items-center justify-center rounded-full leading-none font-semibold text-white",
        counterSizeClass,
      )}
    >
      {counterContent}
    </span>
  ) : null;

  if (asChild) {
    const slotProps = props as Omit<
      React.ComponentProps<typeof Slot.Root>,
      "children"
    >;

    return (
      <Slot.Root
        data-slot="icon-button"
        data-variant={variant}
        data-size={size}
        className={sharedClassName}
        style={mergedStyle}
        {...slotProps}
      >
        {content}
        {counterBadge}
      </Slot.Root>
    );
  }

  if (href) {
    const linkProps = props as AnchorProps;

    return (
      <Link
        href={href}
        data-slot="icon-button"
        data-variant={variant}
        data-size={size}
        className={sharedClassName}
        style={mergedStyle}
        {...linkProps}
      >
        {content}
        {counterBadge}
      </Link>
    );
  }

  const buttonProps = props as ButtonProps;

  return (
    <button
      data-slot="icon-button"
      data-variant={variant}
      data-size={size}
      className={sharedClassName}
      style={mergedStyle}
      {...buttonProps}
    >
      {content}
      {counterBadge}
    </button>
  );
}

export { IconButton, iconButtonVariants };
