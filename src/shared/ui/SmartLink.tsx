import { Link, useRouter } from '@tanstack/react-router'
import type { AnchorHTMLAttributes } from 'react'

type SmartLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string
}

/**
 * Внутренняя ссылка без перезагрузки документа, если у адреса есть маршрут в роутере, иначе обычный `<a>`.
 * Старый сайт и данные API ведут на адреса, которых в routes/ пока нет (каталог, акции, бренды): для них
 * `Link` отдал бы 404 роутера, а `<a>` отдаёт страницу старого сайта. Внешние, tel:, mailto:, target=_blank и
 * адреса с query и рендер вне роутера (тесты) остаются обычным `<a>`. Когда маршрут появится в routes/, ссылка станет клиентской сама.
 */
export function SmartLink({ href, target, ...props }: SmartLinkProps) {
  const router = useRouter({ warn: false })
  const isInternal = href.startsWith('/') && !href.startsWith('//') && !href.includes('?') && !target
  if (isInternal && router) {
    const hashIndex = href.indexOf('#')
    const pathname = hashIndex === -1 ? href : href.slice(0, hashIndex)
    const hash = hashIndex === -1 ? undefined : href.slice(hashIndex + 1)
    const [, , foundRoute] = router.getMatchedRoutes(pathname)
    if (foundRoute) {
      // Тип `to` знает только маршруты из routeTree, а адрес приходит строкой (данные API, статика)
      return <Link to={pathname as '/'} {...(hash ? { hash } : {})} {...props} />
    }
  }
  // Содержимое приходит через props.children
  // oxlint-disable-next-line jsx-a11y/anchor-has-content
  return <a href={href} target={target} {...props} />
}
