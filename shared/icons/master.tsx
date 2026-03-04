import * as React from "react";
import type { SVGProps } from "react";
const SvgMaster = (props: SVGProps<SVGSVGElement>) => (
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
      d="M24 30a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1zm-10-3-.204.01A2 2 0 0 0 12 29v7.75c-3.449-.892-6-4.072-6-7.86 0-4.478 3.567-8.11 7.968-8.11H14zm12.032-6.22c4.4 0 7.968 3.632 7.968 8.11 0 3.788-2.551 6.968-6 7.86V29a2 2 0 0 0-1.796-1.99L26 27v-6.22zM24 27h-8v-6.22h8zM20 2c4.4 0 7.968 3.63 7.968 8.11 0 4.478-3.567 8.11-7.968 8.11s-7.968-3.632-7.968-8.11C12.032 5.63 15.6 2 20 2"
    />
  </svg>
);
export default SvgMaster;
