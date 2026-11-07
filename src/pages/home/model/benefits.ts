export type BenefitItem = {
  key: string
  iconSrc: string
  iconWidth: number
  iconHeight: number
  text: string
}

export const HOME_BENEFITS: BenefitItem[] = [
  {
    key: 'trust',
    iconSrc: '/images/benefits/handshake.webp',
    iconWidth: 32,
    iconHeight: 32,
    text: 'Нам доверяют ведущие\nпроизводители техники',
  },
  {
    key: 'delivery',
    iconSrc: '/images/benefits/location-tick.webp',
    iconWidth: 24,
    iconHeight: 24,
    text: 'Доставка\nпо всей России',
  },
  {
    key: 'guarantee',
    iconSrc: '/images/benefits/guarantee.webp',
    iconWidth: 24,
    iconHeight: 24,
    text: 'Гарантия качества\nвсех товаров',
  },
  {
    key: 'call',
    iconSrc: '/images/benefits/free-call.webp',
    iconWidth: 24,
    iconHeight: 24,
    text: 'Звоните нам\n8-800-333-555-6',
  },
]
