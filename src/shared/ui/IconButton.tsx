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
import styles from './IconButton.module.css'

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
  default: styles.variantDefault,
  filled: styles.variantFilled,
  ghost: styles.variantGhost,
  inverse: styles.variantInverse,
}

const sizes: Record<IconButtonSize, string> = {
  xs: styles.sizeXs,
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
  nav: styles.sizeNav,
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
    styles.root,
    variants[variant],
    sizes[size],
    isActive && activeClassName,
    disableHover && styles.keepColor,
    className,
  )

  const hasCounter = typeof counter === 'number' && Number.isFinite(counter) && counter > 0
  const counterContent = hasCounter ? (counter > 99 ? '99+' : counter) : null
  const isSingleDigit = typeof counterContent === 'number' && counterContent < 10
  const counterBadge = hasCounter ? (
    <span
      aria-hidden
      className={cn(
        styles.counter,
        size === 'nav' && styles.counterNav,
        size === 'lg' && styles.counterLg,
        !isSingleDigit && styles.counterWide,
      )}
    >
      {counterContent}
    </span>
  ) : null

  const element =
    href !== undefined ? (
      <SmartLink
        href={href}

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
