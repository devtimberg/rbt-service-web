import { createElement } from 'react'
import { cn } from '@/shared/lib/cn'

type HeadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

type HeadingProps = {
  size?: HeadingSize
  className?: string
  children: string
}

const tags = { xs: 'h5', sm: 'h4', md: 'h3', lg: 'h2', xl: 'h1' } as const

const sizes = {
  xs: 'text-[14px] leading-[18px] font-medium',
  sm: 'text-[18px] font-medium',
  md: 'text-[20px] font-medium',
  lg: 'text-[21px] leading-[28px] font-semibold sm:text-[24px] sm:leading-[38px]',
  xl: 'text-[40px] leading-[48px] font-semibold',
} as const

/** Заголовок: уровень h1–h5 выбирается по размеру (xl → h1 … xs → h5). */
export function Heading({ children, size = 'md', className }: HeadingProps) {
  return createElement(tags[size], { className: cn('cursor-default text-current', sizes[size], className) }, children)
}
