import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ElementType,
  isValidElement,
  type ReactElement,
  type ReactNode,
  type SVGProps,
} from 'react'
import { cn } from '@/shared/lib/cn'
import { usePathname } from '@/shared/lib/usePathname'
import { SmartLink } from './SmartLink'
import { Tooltip } from './Tooltip'

type IconComponent = ElementType<SVGProps<SVGSVGElement>>
type IconButtonVariant = 'default' | 'filled' | 'ghost' | 'inverse'
type IconButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'nav'

type SharedProps = {
  variant?: IconButtonVariant
  size?: IconButtonSize
  children?: ReactNode
  icon?: IconComponent | ReactElement
  /** Размер иконки в пикселях (по умолчанию 24). */
  iconSize?: number
  /** Бейдж-счётчик в углу; 0, null и undefined скрывают его, больше 99 показывается как «99+». */
  counter?: number | null
  /** Подсказка при наведении (CSS, без портала). */
  tooltip?: string
  /** Классы, которые добавляются, когда кнопка-ссылка активна. */
  activeClassName?: string
  matchPath?: 'exact' | 'prefix'
  /** Дополнительные pathname, при которых кнопка считается активной (для нав-вкладок с подстраницами) */
  additionalActivePaths?: string[]
  disableHover?: boolean
}

type IconButtonAsButtonProps = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & { href?: undefined }
/** Со `href` кнопка рендерится как SmartLink и получает aria-current="page" на активном адресе. */
type IconButtonAsLinkProps = SharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'href'> & { href: string; type?: never; disabled?: never }
export type IconButtonProps = IconButtonAsButtonProps | IconButtonAsLinkProps

const variants: Record<IconButtonVariant, string> = {
  default: 'bg-[#F3F7FF] text-tertiary hover:bg-[#E8EEFB] active:bg-[#E8EEFB]',
  filled: 'bg-[#F3F7FF] text-primary-900 hover:bg-[#E8EEFB] active:bg-[#E8EEFB]',
  ghost: 'bg-transparent text-primary-100 hover:bg-transparent aria-[current=page]:text-primary-500',
  inverse: 'bg-transparent text-white',
}

const sizes: Record<IconButtonSize, string> = {
  xs: "size-6 [&_svg:not([class*='size-'])]:size-3",
  sm: 'size-8',
  md: 'size-9',
  lg: 'size-10',
  nav: 'size-10',
}

export function IconButton({
  className,
  variant = 'ghost',
  size = 'md',
  children,
  icon,
  iconSize = 24,
  counter,
  tooltip,
  activeClassName,
  matchPath = 'exact',
  additionalActivePaths,
  disableHover = false,
  href,
  style,
  ...props
}: IconButtonProps) {
  const pathname = usePathname()
  const isActive =
    (href !== undefined &&
      (matchPath === 'prefix' ? pathname === href || pathname.startsWith(`${href}/`) : pathname === href)) ||
    (additionalActivePaths?.includes(pathname) ?? false)

  const Icon = icon !== undefined && !isValidElement(icon) ? (icon as IconComponent) : null
  const content = children ?? (Icon ? <Icon /> : (icon as ReactElement | undefined))
  const mergedStyle = { ...style, '--icon-size': `${iconSize}px` } as CSSProperties

  const classes = cn(
    'relative inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md transition-all',
    'focus-visible:ring-[3px] focus-visible:ring-focus-ring/50 disabled:pointer-events-none disabled:opacity-50',
    'aria-invalid:border-danger-700 aria-invalid:ring-danger-700/20 [&_svg]:pointer-events-none [&_svg]:shrink-0',
    '[&_svg]:h-(--icon-size) [&_svg]:w-(--icon-size)',
    variants[variant],
    sizes[size],
    isActive && activeClassName,
    disableHover &&
      (variant === 'ghost'
        ? isActive
          ? 'hover:bg-transparent hover:text-primary-500'
          : 'hover:bg-transparent hover:text-primary-100'
        : undefined),
    className,
  )

  const hasCounter = typeof counter === 'number' && Number.isFinite(counter) && counter > 0
  const counterContent = hasCounter ? (counter > 99 ? '99+' : counter) : null
  const isSingleDigit = typeof counterContent === 'number' && counterContent < 10
  const counterSize =
    size === 'lg'
      ? isSingleDigit
        ? 'h-5 w-5 text-xs'
        : 'min-h-5 min-w-5 px-1.5 text-xs'
      : isSingleDigit
        ? 'h-4 w-4 text-[10px]'
        : 'min-h-4 min-w-4 px-1 text-[10px]'
  const counterBadge = hasCounter ? (
    <span
      aria-hidden
      className={cn(
        'absolute inline-flex items-center justify-center rounded-xl bg-secondary-500 leading-none font-semibold text-inverse',
        size === 'nav' ? '-top-1 -right-2' : 'top-0 right-0',
        counterSize,
      )}
    >
      {counterContent}
    </span>
  ) : null

  const element =
    href !== undefined ? (
      <SmartLink
        href={href}
        data-slot="icon-button"
        data-variant={variant}
        data-size={size}
        className={classes}
        style={mergedStyle}
        {...(isActive ? { 'aria-current': 'page' as const } : {})}
        {...(props as Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>)}
      >
        {content}
        {counterBadge}
      </SmartLink>
    ) : (
      <button
        type="button"
        data-slot="icon-button"
        data-variant={variant}
        data-size={size}
        className={classes}
        style={mergedStyle}
        {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
        {counterBadge}
      </button>
    )

  return tooltip ? <Tooltip content={tooltip}>{element}</Tooltip> : element
}
