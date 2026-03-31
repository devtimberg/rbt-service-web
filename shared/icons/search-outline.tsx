import * as React from "react";
import type { SVGProps } from "react";
const SvgSearchOutline = (props: SVGProps<SVGSVGElement>) => (
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
      d="M14.2 2.5C7.738 2.5 2.5 7.738 2.5 14.2s5.238 11.7 11.7 11.7 11.7-5.238 11.7-11.7S20.662 2.5 14.2 2.5M4.3 14.2c0-5.468 4.432-9.9 9.9-9.9s9.9 4.432 9.9 9.9-4.432 9.9-9.9 9.9-9.9-4.432-9.9-9.9"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      d="M24.437 23.164a.9.9 0 1 0-1.273 1.272l4.8 4.8a.9.9 0 1 0 1.272-1.272z"
    />
  </svg>
);
export default SvgSearchOutline;
