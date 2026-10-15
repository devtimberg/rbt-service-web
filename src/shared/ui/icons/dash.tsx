import * as React from 'react'
import type { SVGProps } from 'react'
const SvgDash = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={3}
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M5 12h14" />
  </svg>
)
export default SvgDash
