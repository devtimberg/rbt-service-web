export type BenefitItem = {
  key: string
  iconSrc: string
  iconWidth: number
  iconHeight: number
  text: string
}

export const HOME_BENEFITS: BenefitItem[] = [
  {
    key: 'payment',
    iconSrc: '/images/benefits/wallet.webp',
    iconWidth: 48,
    iconHeight: 48,
    text: 'Наличный или\nбезналичный расчет',
  },
  {
    key: 'delivery',
    iconSrc: '/images/benefits/location-tick.webp',
    iconWidth: 24,
    iconHeight: 24,
    text: 'Доставка\nпо всей России',
  },
  {
    key: 'return',
    iconSrc: '/images/benefits/return-30.webp',
    iconWidth: 24,
    iconHeight: 24,
    text: 'Возврат товара\nв течение 30 дней',
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
    text: 'Бесплатный звонок\n8-800-333-555-6',
  },
]
