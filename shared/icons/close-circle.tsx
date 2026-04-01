import * as React from "react";
import type { SVGProps } from "react";
const SvgCloseCircle = (props: SVGProps<SVGSVGElement>) => (
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
      d="M16 29.333c7.364 0 13.333-5.97 13.333-13.333S23.363 2.667 16 2.667 2.667 8.637 2.667 16 8.637 29.333 16 29.333m3.535-15.13a1 1 0 1 0-1.414-1.415L16 14.909l-2.121-2.121a1 1 0 0 0-1.415 1.414l2.122 2.121-2.122 2.122a1 1 0 1 0 1.415 1.414L16 17.738l2.121 2.121a1 1 0 0 0 1.415-1.414l-2.122-2.122z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgCloseCircle;
