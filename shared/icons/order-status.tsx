import * as React from "react";
import type { SVGProps } from "react";
const SvgOrderStatus = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 40 40"
    {...props}
  >
    <path
      fill="#fff"
      fillRule="evenodd"
      d="M17.917 5.417v3.027a1.25 1.25 0 1 1-2.5 0V5.417H10.74a8.657 8.657 0 0 0-8.658 8.657c0 1.386.795 2.65 2.045 3.25l.812.39c1.919.92 1.919 3.652 0 4.573l-.812.39a3.6 3.6 0 0 0-2.045 3.249 8.657 8.657 0 0 0 8.658 8.657h4.676v-3.027a1.25 1.25 0 0 1 2.5 0v3.027h11.342a8.657 8.657 0 0 0 8.658-8.657c0-1.386-.795-2.65-2.045-3.25l-.812-.39c-1.919-.92-1.919-3.652 0-4.573l.812-.39a3.6 3.6 0 0 0 2.045-3.249 8.657 8.657 0 0 0-8.658-8.657zm-1.25 7.11c-.69 0-1.25.56-1.25 1.25v3.556a1.25 1.25 0 0 0 2.5 0v-3.555c0-.69-.56-1.25-1.25-1.25m-1.25 10.14a1.25 1.25 0 0 1 2.5 0v3.555a1.25 1.25 0 0 1-2.5 0z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgOrderStatus;
