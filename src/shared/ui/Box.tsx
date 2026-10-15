import type { ComponentProps } from 'react'

/** Нейтральный контейнер-div: точка расширения без собственных стилей. */
export function Box({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="box" className={className} {...props} />
}
