import * as React from "react";
import type { SVGProps } from "react";
const SvgHeartOutline = (props: SVGProps<SVGSVGElement>) => (
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
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={1.333}
      d="M22.327 4.682c1.381-.101 2.866.29 4.28 1.732 1.684 1.719 2.236 3.832 2.013 6.092-.226 2.28-1.244 4.7-2.693 6.93-1.445 2.225-3.292 4.22-5.12 5.653-1.858 1.455-3.588 2.244-4.807 2.244s-2.949-.79-4.806-2.244c-1.828-1.432-3.675-3.428-5.121-5.653-1.448-2.23-2.467-4.65-2.692-6.93-.224-2.26.328-4.373 2.013-6.092 1.414-1.441 2.898-1.833 4.28-1.732 1.414.103 2.765.73 3.835 1.409 1.478.938 3.503.938 4.982 0 1.07-.679 2.421-1.306 3.836-1.41Z"
    />
  </svg>
);
export default SvgHeartOutline;
