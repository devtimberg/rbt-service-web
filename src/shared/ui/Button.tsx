import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import { LoaderIcon } from './icons'
import { SmartLink } from './SmartLink'

export type ButtonVariant = 'default' | 'primary' | 'secondary' | 'disabled' | 'ghost' | 'link' | 'inverse'
export type ButtonSize = 'md' | 'sm' | 'xs' | 'lg' | 'full' | 'icon' | 'iconRight'
export type ButtonRounded = 'default' | 'full' | 'md' | 'lg'

type ButtonStyleProps = {
  variant?: ButtonVariant | undefined
  size?: ButtonSize | undefined
  rounded?: ButtonRounded | undefined
  /** Иконка слева от текста. */
  icon?: ReactNode
  className?: string | undefined
}

type ButtonAsButtonProps = ButtonStyleProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
    href?: undefined
    /** Показывает спиннер и блокирует кнопку. */
    loading?: boolean
  }

/**
 * Ссылка с видом кнопки: передайте `href` и получите SmartLink. Прежний `<Button asChild><Link/></Button>`
 * заменяется на `<Button href="...">`.
 */
type ButtonAsLinkProps = ButtonStyleProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'href'> & {
    href: string
    loading?: undefined
  }

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps

const variants: Record<ButtonVariant, string> = {
  default: 'bg-action-primary-bg text-action-primary-fg hover:bg-action-primary-bg/90',
  primary: 'bg-primary-900 text-inverse hover:bg-primary-900/90',
  secondary: 'bg-primary-100/10 text-primary-900 hover:bg-primary-100/15',
  disabled: 'bg-primary-100/10 text-primary-100/30 hover:bg-primary-100/15',
  ghost: 'hover:bg-surface-subtle hover:text-primary',
  link: 'text-link hover:text-link/90 m-0 h-auto rounded-none p-0',
  inverse: 'bg-primary-900 text-inverse',
}

const sizes: Record<ButtonSize, string> = {
  md: 'h-12 px-6 text-[16px] leading-[16px]',
  sm: 'h-9 px-3 text-[14px] leading-[18px]',
  xs: 'h-7 px-3',
  lg: 'h-12 px-4',
  full: 'w-full py-2',
  icon: 'h-10 w-10',
  // Прежний вариант использовал несуществующие primary-700/primary-foreground: приведён к токенам primary-500/inverse
  iconRight: 'h-10 gap-2 bg-primary-500 pr-3 pl-4 text-inverse hover:bg-primary-500/90',
}

const radii: Record<ButtonRounded, string> = {
  default: 'rounded-[12px]',
  full: 'rounded-full',
  md: 'rounded-md',
  lg: 'rounded-lg',
}

/** Классы кнопки отдельно от компонента: нужны, когда элемент строится вручную (пагинация и т.п.). */
export function buttonClass({
  variant = 'primary',
  size = 'md',
  rounded = 'default',
  className,
}: ButtonStyleProps = {}) {
  return cn(
    'relative inline-flex cursor-pointer items-center justify-center font-semibold whitespace-nowrap transition-colors',
    'focus-visible:outline-none disabled:pointer-events-none disabled:cursor-not-allowed',
    variants[variant],
    sizes[size],
    radii[rounded],
    className,
  )
}

export function Button(props: ButtonProps) {
  const { variant, size, rounded, icon, className, ...rest } = props
  const classes = buttonClass({ variant, size, rounded, className })

  if (rest.href !== undefined) {
    const { href, loading: _loading, children, ...anchor } = rest
    return (
      <SmartLink href={href} data-slot="button" className={classes} {...anchor}>
        <span className="inline-flex items-center gap-2">
          {icon}
          {children}
        </span>
      </SmartLink>
    )
  }

  const { href: _href, loading = false, disabled, children, type = 'button', ...button } = rest
  return (
    <button
      type={type}
      data-slot="button"
      className={classes}
      disabled={loading || disabled}
      aria-busy={loading || undefined}
      {...button}
    >
      {loading ? (
        <span className="absolute inset-0 flex items-center justify-center">
          <LoaderIcon className="size-5 animate-spin text-current" />
        </span>
      ) : null}
      <span className={cn('inline-flex items-center gap-2', loading && 'invisible')}>
        {icon}
        {children}
      </span>
    </button>
  )
}
