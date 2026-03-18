import * as React from "react";
import type { SVGProps } from "react";
const SvgMaster = (props: SVGProps<SVGSVGElement>) => (
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
      d="M19.2 24a.8.8 0 0 1 .8.8v4a.8.8 0 0 1-.8.8h-6.4a.8.8 0 0 1-.8-.8v-4a.8.8 0 0 1 .8-.8zm-8-2.4-.164.008A1.6 1.6 0 0 0 9.6 23.2v6.2c-2.76-.714-4.8-3.258-4.8-6.288 0-3.583 2.854-6.487 6.374-6.488h.026zm9.625-4.976c3.52 0 6.375 2.905 6.375 6.488 0 3.03-2.041 5.574-4.8 6.288v-6.2a1.6 1.6 0 0 0-1.6-1.6v-4.976zM19.2 21.6h-6.4v-4.976h6.4zM16 1.6c3.52 0 6.374 2.905 6.374 6.488S19.52 14.576 16 14.576 9.626 11.67 9.626 8.088 12.48 1.6 16 1.6"
    />
  </svg>
);
export default SvgMaster;
