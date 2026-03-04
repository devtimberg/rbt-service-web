export type BenefitItem = {
  key: string;
  iconSrc: string;
  iconWidth: number;
  iconHeight: number;
  text: string;
};

export const HOME_BENEFITS: BenefitItem[] = [
  {
    key: "payment",
    iconSrc: "/icon/wallet.png",
    iconWidth: 48,
    iconHeight: 48,
    text: "Наличный или\nбезналичный расчет",
  },
  {
    key: "delivery",
    iconSrc: "/icon/location-tick.png",
    iconWidth: 24,
    iconHeight: 24,
    text: "Доставка\nпо всей России",
  },
  {
    key: "return",
    iconSrc: "/icon/return-30.png",
    iconWidth: 24,
    iconHeight: 24,
    text: "Возврат товара\nв течение 30 дней",
  },
  {
    key: "guarantee",
    iconSrc: "/icon/guarantee.png",
    iconWidth: 24,
    iconHeight: 24,
    text: "Гарантия качества\nвсех товаров",
  },
  {
    key: "call",
    iconSrc: "/icon/free-call.png",
    iconWidth: 24,
    iconHeight: 24,
    text: "Бесплатный звонок\n8-800-333-555-6",
  },
];
