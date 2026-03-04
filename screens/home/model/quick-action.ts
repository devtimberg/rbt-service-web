import {
  CatalogIcon,
  FeedbackIcon,
  HeartIcon,
  MasterIcon,
  OrderDetailIcon,
  OrderStatusIcon,
} from "@/shared/icons";
import { ROUTES } from "@/shared/lib/routes";
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
    href: ROUTES.CATALOG,
    icon: CatalogIcon,
  },
  {
    key: "order-status",
    text: "Статус\nзаказа",
    href: ROUTES.ORDERS_STATUS,
    icon: OrderStatusIcon,
  },
  {
    key: "order-parts",
    text: "Заказать\nзапчасть",
    href: ROUTES.PARTS_REQUEST,
    icon: OrderDetailIcon,
  },
  {
    key: "repair-services",
    text: "Услуги\nремонта",
    href: ROUTES.SERVICES_REPAIR,
    icon: HeartIcon,
  },
  {
    key: "call-master",
    text: "Вызвать\nмастера",
    href: ROUTES.MASTER_CALL,
    icon: MasterIcon,
    isAccent: true,
    colorVariant: "accent",
  },
  {
    key: "feedback",
    text: "Обратная\nсвязь",
    href: ROUTES.FEEDBACK,
    icon: FeedbackIcon,
  },
];
