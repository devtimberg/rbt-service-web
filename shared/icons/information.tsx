import * as React from "react";
import type { SVGProps } from "react";
const SvgInformation = (props: SVGProps<SVGSVGElement>) => (
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
      d="M29.333 16c0 7.364-5.97 13.333-13.333 13.333S2.667 23.363 2.667 16 8.637 2.667 16 2.667 29.333 8.637 29.333 16M16 13.667a1 1 0 0 1 1 1v8a1 1 0 1 1-2 0v-8a1 1 0 0 1 1-1M16 12a1.333 1.333 0 1 0 0-2.667A1.333 1.333 0 0 0 16 12"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgInformation;
