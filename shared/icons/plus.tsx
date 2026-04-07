import * as React from "react";
import type { SVGProps } from "react";
const SvgPlus = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="currentColor"
      d="M12 1.5A2.5 2.5 0 0 1 14.5 4v5.5H20a2.5 2.5 0 0 1 0 5h-5.5V20a2.5 2.5 0 0 1-5 0v-5.5H4a2.5 2.5 0 0 1 0-5h5.5V4A2.5 2.5 0 0 1 12 1.5"
    />
  </svg>
);
export default SvgPlus;
