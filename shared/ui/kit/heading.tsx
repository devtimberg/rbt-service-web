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
    xs: "text-current cursor-default text-[14px] font-medium leading-[18px]",
    sm: "text-current cursor-default text-[18px] font-medium",
    md: "text-current cursor-default text-[20px] font-medium",
    lg: "text-current cursor-default text-[24px] font-semibold leading-[38px]",
    xl: "text-current cursor-default text-[40px] font-semibold leading-[48px]",
  } as const;

  return React.createElement(
    mapTagBySize[size],
    { className: clsx(mapClassNameBySize[size], className) },
    text,
  );
};
