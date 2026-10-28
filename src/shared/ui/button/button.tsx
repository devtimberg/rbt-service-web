import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import { LoaderIcon } from '../icons'
import { SmartLink } from '../smart-link'
import styles from './button.module.css'

/**
 * unstyled: голая `<button>` без классов, оболочки и спиннера — вид целиком из `className`
 * (строки поиска, счётчик количества). У unstyled `size`, `rounded` и `icon` не действуют.
 */
export type ButtonVariant = 'default' | 'primary' | 'secondary' | 'disabled' | 'ghost' | 'link' | 'inverse' | 'unstyled'
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
  Omit<ComponentProps<'button'>, 'className'> & {
    href?: undefined
    /** Показывает спиннер и блокирует кнопку. */
    loading?: boolean
  }

/**
 * Ссылка с видом кнопки: передайте `href` и получите SmartLink. Прежний `<Button asChild><Link/></Button>`
 * заменяется на `<Button href="...">`.
 */
type ButtonAsLinkProps = ButtonStyleProps &
  Omit<ComponentProps<'a'>, 'className' | 'href'> & {
    href: string
    loading?: undefined
  }

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps

const variants: Record<Exclude<ButtonVariant, 'unstyled'>, string> = {
  default: styles.variantDefault,
  primary: styles.variantPrimary,
  secondary: styles.variantSecondary,
  disabled: styles.variantDisabled,
  ghost: styles.variantGhost,
  link: styles.variantLink,
  inverse: styles.variantInverse,
}

const sizes: Record<ButtonSize, string> = {
  md: styles.sizeMd,
  sm: styles.sizeSm,
  xs: styles.sizeXs,
  lg: styles.sizeLg,
  full: styles.sizeFull,
  icon: styles.sizeIcon,
  iconRight: styles.sizeIconRight,
}

const radii: Record<ButtonRounded, string> = {
  default: styles.roundedDefault,
  full: styles.roundedFull,
  md: styles.roundedMd,
  lg: styles.roundedLg,
}

/** Классы кнопки отдельно от компонента: нужны, когда элемент строится вручную (пагинация и т.п.). */
export function buttonClass({
  variant = 'primary',
  size = 'md',
  rounded = 'default',
  className,
}: ButtonStyleProps = {}) {
  return cn(styles.root, variant !== 'unstyled' && variants[variant], sizes[size], radii[rounded], className)
}

export function Button(props: ButtonProps) {
  const { variant, size, rounded, icon, className, ...rest } = props
  if (variant === 'unstyled' && props.href === undefined) {
    const {
      loading: _loading,
      type = 'button',
      children,
      ...button
    } = rest as Omit<ButtonAsButtonProps, keyof ButtonStyleProps>
    return (
      <button type={type} className={className} {...button}>
        {children}
      </button>
    )
  }
  const classes = buttonClass({ variant, size, rounded, className })

  if (rest.href !== undefined) {
    const { href, loading: _loading, children, ...anchor } = rest
    return (
      <SmartLink href={href} className={classes} {...anchor}>
        <span className={styles.content}>
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

      className={classes}
      disabled={loading || disabled}
      aria-busy={loading || undefined}
      {...button}
    >
      {loading ? (
        <span className={styles.loader}>
          <LoaderIcon className={styles.spinner} />
        </span>
      ) : null}
      <span className={cn(styles.content, loading && styles.contentHidden)}>
        {icon}
        {children}
      </span>
    </button>
  )
}
