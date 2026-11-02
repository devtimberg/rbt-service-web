'use client'

import Link from 'next/link'
import type { ComponentProps } from 'react'
import { useNavigationGuard } from '../../lib/navigation-guard'

type SmartLinkProps = Omit<ComponentProps<'a'>, 'href'> & {
  href: string
  /** Реагирует на внутренний переход (событие next/link); вызывается до перехвата гардом навигации. */
  onNavigate?: (event: { preventDefault: () => void }) => void
}

/**
 * Внутренняя ссылка без перезагрузки документа (`next/link`); адрес без маршрута в `app/` открывает `not-found`
 * тем же клиентским переходом. Внешние, tel:, mailto: и target=_blank остаются обычным `<a>`.
 * Предзагрузка выключена: ответ маршрута на переход приходит без данных и кэшируется роутером (`staleTimes`).
 */
export function SmartLink({ href, target, onNavigate, ...props }: SmartLinkProps) {
  const guard = useNavigationGuard()
  const isInternal = href.startsWith('/') && !href.startsWith('//') && !target
  if (isInternal) {
    // Типы Link при exactOptionalPropertyTypes не принимают явный undefined у пропсов; они те же, что у <a>
    return (
      <Link
        href={href}
        prefetch={false}
        {...(props as Omit<ComponentProps<typeof Link>, 'href'>)}
        onNavigate={(event) => {
          // Сначала потребитель: его preventDefault отменяет и перехват гардом.
          let prevented = false
          onNavigate?.({
            preventDefault: () => {
              prevented = true
              event.preventDefault()
            },
          })
          if (prevented || !guard) return
          event.preventDefault()
          guard.navigate(href)
        }}
      />
    )
  }
  // Содержимое приходит через props.children
  // oxlint-disable-next-line jsx-a11y/anchor-has-content
  return <a href={href} target={target} {...props} />
}
