import * as React from "react";
import type { SVGProps } from "react";
const SvgCheck = (props: SVGProps<SVGSVGElement>) => (
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
      d="M16 29.333c7.364 0 13.333-5.97 13.333-13.333S23.363 2.667 16 2.667 2.667 8.637 2.667 16 8.637 29.333 16 29.333m7.412-16.666a1 1 0 1 0-1.49-1.334l-4.493 5.018c-.91 1.016-1.523 1.697-2.047 2.138-.5.42-.793.511-1.049.511s-.55-.091-1.048-.511c-.524-.44-1.137-1.122-2.048-2.138l-1.159-1.295a1 1 0 0 0-1.49 1.334l1.209 1.35c.848.947 1.555 1.737 2.2 2.28.684.574 1.422.98 2.336.98.915 0 1.652-.406 2.336-.98.646-.543 1.353-1.333 2.2-2.28z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgCheck;
