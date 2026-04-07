import * as React from "react";
import type { SVGProps } from "react";
const SvgMinus = (props: SVGProps<SVGSVGElement>) => (
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
      d="M26.667 12.667a3.333 3.333 0 0 1 0 6.666H5.333a3.333 3.333 0 0 1 0-6.666z"
    />
  </svg>
);
export default SvgMinus;
