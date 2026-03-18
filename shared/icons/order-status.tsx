import * as React from "react";
import type { SVGProps } from "react";
const SvgOrderStatus = (props: SVGProps<SVGSVGElement>) => (
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
      d="M14.333 4.333v2.423a1 1 0 1 1-2 0V4.333h-3.74a6.926 6.926 0 0 0-6.926 6.926c0 1.11.636 2.12 1.635 2.6l.65.312c1.535.736 1.535 2.922 0 3.658l-.65.312c-1 .48-1.635 1.49-1.635 2.6 0 3.825 3.1 6.926 6.926 6.926h3.74v-2.423a1 1 0 1 1 2 0v2.423h9.074c3.826 0 6.926-3.101 6.926-6.926 0-1.11-.636-2.12-1.635-2.6l-.65-.312c-1.535-.736-1.535-2.922 0-3.658l.65-.312c1-.48 1.635-1.49 1.635-2.6 0-3.825-3.1-6.926-6.926-6.926zm-1 5.69a1 1 0 0 0-1 1v2.844a1 1 0 1 0 2 0v-2.845a1 1 0 0 0-1-1m-1 8.11a1 1 0 1 1 2 0v2.845a1 1 0 0 1-2 0z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgOrderStatus;
