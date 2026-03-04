import {
  CatalogIcon,
  FeedbackIcon,
  HeartIcon,
  MasterIcon,
  OrderDetailIcon,
  OrderStatusIcon,
} from "@/shared/icons";
import type { ElementType, SVGProps } from "react";

type IconComponent = ElementType<SVGProps<SVGSVGElement>>;

export type QuickActionItem = {
  key: string;
  text: string;
  href: string;
  icon: IconComponent;
  isAccent?: boolean;
  colorVariant?: "default" | "accent";
};

export const HOME_QUICK_ACTIONS: QuickActionItem[] = [
  {
    key: "catalog",
    text: "Каталог\nзапчастей",
    href: "/catalog",
    icon: CatalogIcon,
  },
  {
    key: "order-status",
    text: "Статус\nзаказа",
    href: "/orders/status",
    icon: OrderStatusIcon,
  },
  {
    key: "order-parts",
    text: "Заказать\nзапчасть",
    href: "/parts/request",
    icon: OrderDetailIcon,
  },
  {
    key: "repair-services",
    text: "Услуги\nремонта",
    href: "/services/repair",
    icon: HeartIcon,
  },
  {
    key: "call-master",
    text: "Вызвать\nмастера",
    href: "/master-call",
    icon: MasterIcon,
    isAccent: true,
    colorVariant: "accent",
  },
  {
    key: "feedback",
    text: "Обратная\nсвязь",
    href: "/feedback",
    icon: FeedbackIcon,
  },
];
