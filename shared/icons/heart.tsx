import * as React from "react";
import type { SVGProps } from "react";
const SvgHeart = (props: SVGProps<SVGSVGElement>) => (
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
      d="M27.082 5.948c-3.112-3.174-6.716-1.836-8.948-.42-1.26.8-3.007.8-4.268 0-2.232-1.416-5.836-2.754-8.948.42C-2.47 13.482 10.2 28 16 28S34.47 13.482 27.082 5.948"
    />
  </svg>
);
export default SvgHeart;
