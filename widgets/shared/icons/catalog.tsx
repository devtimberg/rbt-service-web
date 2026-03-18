import * as React from "react";
import type { SVGProps } from "react";
const SvgCatalog = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 32 32"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M5.273 5.415C4 7.167 4 9.667 4 14.667v2.666c0 5 0 7.5 1.273 9.252a6.7 6.7 0 0 0 1.475 1.475C8.501 29.333 11 29.333 16 29.333s7.5 0 9.252-1.273a6.7 6.7 0 0 0 1.475-1.475C28 24.833 28 22.333 28 17.333v-2.666c0-5 0-7.5-1.273-9.252a6.7 6.7 0 0 0-1.475-1.475C23.5 2.667 21 2.667 16 2.667s-7.5 0-9.252 1.273a6.7 6.7 0 0 0-1.475 1.475m5.394 4.252a1 1 0 1 0 0 2h10.666a1 1 0 1 0 0-2zm0 5.333a1 1 0 1 0 0 2h10.666a1 1 0 1 0 0-2zm0 5.333a1 1 0 1 0 0 2h4a1 1 0 0 0 0-2z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgCatalog;
