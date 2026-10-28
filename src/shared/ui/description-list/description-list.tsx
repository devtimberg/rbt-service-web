import type { ComponentProps } from 'react'

/**
 * Список «подпись — значение» (`dl`): строки стоимости в итогах корзины и заказа, реквизиты.
 * Строку `dt` + `dd` можно обернуть в `Box` (`div` внутри `dl` допустим) ради flex-раскладки.
 */
export function DescriptionList(props: ComponentProps<'dl'>) {
  return <dl {...props} />
}

/** Подпись строки (`dt`). */
export function DescriptionTerm(props: ComponentProps<'dt'>) {
  return <dt {...props} />
}

/** Значение строки (`dd`). */
export function DescriptionDetails(props: ComponentProps<'dd'>) {
  return <dd {...props} />
}
