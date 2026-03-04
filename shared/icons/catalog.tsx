import * as React from "react";
import type { SVGProps } from "react";
const SvgCatalog = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 40 40"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M6.592 6.769C5 8.959 5 12.084 5 18.333v3.334c0 6.25 0 9.374 1.592 11.565a8.3 8.3 0 0 0 1.843 1.843c2.19 1.592 5.315 1.592 11.565 1.592s9.374 0 11.565-1.592a8.3 8.3 0 0 0 1.843-1.843C35 31.04 35 27.916 35 21.667v-3.334c0-6.25 0-9.374-1.592-11.564a8.3 8.3 0 0 0-1.843-1.844C29.375 3.333 26.25 3.333 20 3.333s-9.374 0-11.565 1.592a8.3 8.3 0 0 0-1.843 1.844m6.741 5.314a1.25 1.25 0 0 0 0 2.5h13.334a1.25 1.25 0 0 0 0-2.5zm0 6.667a1.25 1.25 0 0 0 0 2.5h13.334a1.25 1.25 0 0 0 0-2.5zm0 6.667a1.25 1.25 0 0 0 0 2.5h5a1.25 1.25 0 1 0 0-2.5z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgCatalog;
