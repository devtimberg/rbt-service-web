import * as React from "react";
import type { SVGProps } from "react";
const SvgSearch = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 32 32"
    {...props}
  >
    <path
      fill="#8B92A5"
      fillRule="evenodd"
      d="M14.222 2.667C7.84 2.667 2.667 7.84 2.667 14.222S7.84 25.778 14.222 25.778s11.556-5.174 11.556-11.556S20.604 2.667 14.222 2.667M4.444 14.222c0-5.4 4.378-9.778 9.778-9.778S24 8.822 24 14.222 19.622 24 14.222 24s-9.778-4.378-9.778-9.778"
      clipRule="evenodd"
    />
    <path
      fill="#8B92A5"
      d="M24.332 23.075a.889.889 0 1 0-1.257 1.257l4.74 4.741a.889.889 0 0 0 1.258-1.257z"
    />
  </svg>
);
export default SvgSearch;
