import * as React from "react";
import type { SVGProps } from "react";
const SvgHeart = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <g clipPath="url(#heart_svg__a)">
      <path
        fill="#fff"
        d="M20.312 4.46c-2.335-2.38-5.038-1.376-6.711-.314-.946.6-2.256.6-3.202 0-1.673-1.062-4.376-2.066-6.71.315C-1.852 10.11 7.649 21 12 21c4.35 0 13.853-10.889 8.311-16.54"
      />
    </g>
    <defs>
      <clipPath id="heart_svg__a">
        <path
          fill="#fff"
          d="M2 3h20v18H2z"
        />
      </clipPath>
    </defs>
  </svg>
);
export default SvgHeart;
