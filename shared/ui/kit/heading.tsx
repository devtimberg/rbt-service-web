import clsx from "clsx";
import React from "react";

type TitleSize = "xs" | "sm" | "md" | "lg" | "xl";

interface Props {
  size?: TitleSize;
  className?: string;
  children: string;
}

export const Heading: React.FC<Props> = ({
  children: text,
  size = "md",
  className,
}) => {
  const mapTagBySize = {
    xs: "h5",
    sm: "h4",
    md: "h3",
    lg: "h2",
    xl: "h1",
  } as const;

  const mapClassNameBySize = {
    xs: "text-primary cursor-default text-[14px] font-medium leading-[18px]",
    sm: "text-primary cursor-default text-[18px] font-medium",
    md: "text-primary cursor-default text-[20px] font-medium",
    lg: "text-primary cursor-default text-[26px] font-semibold leading-[38px]",
    xl: "text-primary cursor-default text-[32px] font-semibold leading-[38px]",
  } as const;

  return React.createElement(
    mapTagBySize[size],
    { className: clsx(mapClassNameBySize[size], className) },
    text,
  );
};
