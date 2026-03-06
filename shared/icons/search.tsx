import * as React from "react";
import type { SVGProps } from "react";
const SvgSearch = (props: SVGProps<SVGSVGElement>) => (
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
      fillRule="evenodd"
      d="M2 10a9 9 0 1 1 18 0 9 9 0 0 1-18 0m7.959-6.056a.75.75 0 0 1-.624.858 4.25 4.25 0 0 0-3.533 3.533.75.75 0 0 1-1.481-.235A5.75 5.75 0 0 1 9.1 3.32a.75.75 0 0 1 .858.624"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      d="M18.47 17.47a.75.75 0 0 1 1.06 0l4 4a.75.75 0 0 1-1.06 1.06l-4-4a.75.75 0 0 1 0-1.06"
    />
  </svg>
);
export default SvgSearch;
