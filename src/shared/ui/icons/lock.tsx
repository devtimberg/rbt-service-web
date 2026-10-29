import * as React from 'react'
import type { SVGProps } from 'react'
const SvgLock = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 20 20" {...props}>
    <path
      stroke="currentColor"
      strokeWidth={2}
      d="M6.25 9.167h7.5c1.15 0 2.083.932 2.083 2.083v4.167c0 1.15-.932 2.083-2.083 2.083h-7.5a2.083 2.083 0 0 1-2.083-2.083V11.25c0-1.15.932-2.083 2.083-2.083Z"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={2}
      d="M6.667 9.167v-2.5a3.333 3.333 0 0 1 6.666 0v2.5"
    />
  </svg>
)
export default SvgLock
