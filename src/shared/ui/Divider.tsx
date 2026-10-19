import type { ComponentProps } from 'react'

/** Горизонтальная линия `hr` без своих стилей: цвет и толщина из `className` (`border-divider` и т. п.). */
export function Divider(props: ComponentProps<'hr'>) {
  return <hr {...props} />
}
