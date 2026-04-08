import * as React from "react";
import type { SVGProps } from "react";
const SvgClose = (props: SVGProps<SVGSVGElement>) => (
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
      d="M26.04 7.374a1 1 0 0 0-1.414-1.414L16 14.586 7.374 5.96A1 1 0 0 0 5.96 7.374L14.586 16 5.96 24.626a1 1 0 0 0 1.414 1.415L16 17.414l8.626 8.627a1 1 0 0 0 1.415-1.415L17.414 16z"
    />
  </svg>
);
export default SvgClose;
