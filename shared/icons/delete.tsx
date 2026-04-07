import * as React from "react";
import type { SVGProps } from "react";
const SvgDelete = (props: SVGProps<SVGSVGElement>) => (
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
      d="m24.34 19.553.35-2.514q.161-1.158.293-2.128c.18-1.333.27-2-.129-2.455C24.456 12 23.771 12 22.401 12H9.6c-1.37 0-2.055 0-2.453.456-.399.456-.309 1.122-.129 2.455q.131.97.293 2.128l.35 2.514c.38 2.731.57 4.097.973 5.194.754 2.051 2.057 3.58 3.612 4.236.831.35 1.806.35 3.755.35 1.95 0 2.924 0 3.755-.35 1.555-.657 2.858-2.185 3.612-4.236.403-1.097.593-2.463.973-5.194m-10.007-4.886a1 1 0 1 0-2 0v10.666a1 1 0 0 0 2 0zm5.334 0a1 1 0 0 0-2 0v10.666a1 1 0 0 0 2 0z"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      d="M16 1.667A6.333 6.333 0 0 0 9.667 8v.333H5.333a1 1 0 1 0 0 2h21.334a1 1 0 0 0 0-2h-4.334V8A6.333 6.333 0 0 0 16 1.667"
    />
  </svg>
);
export default SvgDelete;
