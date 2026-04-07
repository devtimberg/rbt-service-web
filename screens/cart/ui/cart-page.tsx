"use client";

import { BagIcon } from "@/shared/icons";
import { useCartStore } from "@/shared/lib/stores";
import {
  Box,
  Breadcrumb,
  Chip,
  Container,
  Heading,
  Text,
} from "@/shared/ui/kit";
import { Footer } from "@/widgets/footer";
import { MOCK_PRODUCTS } from "@/screens/catalog/model";
import type { Product } from "@/screens/catalog/model";
import { CartItem } from "./cart-item";
import { CartSummary } from "./cart-summary";

const BREADCRUMB_ITEMS = [{ label: "Корзина" }];

function pluralizeItems(count: number): string {
  const lastTwo = count % 100;
  const lastOne = count % 10;

  if (lastTwo >= 11 && lastTwo <= 19) return `${count} товаров`;
  if (lastOne === 1) return `${count} товар`;
  if (lastOne >= 2 && lastOne <= 4) return `${count} товара`;
  return `${count} товаров`;
}

export function CartPage() {
  const cartItems = useCartStore((s) => s.items);

  // Get products that are in the cart
  const cartProducts: (Product & { quantity: number })[] = [];
  for (const [id, qty] of cartItems) {
    const product = MOCK_PRODUCTS.find((p) => p.id === id);
    if (product) {
      cartProducts.push({ ...product, quantity: qty });
    }
  }

  const inStockProducts = cartProducts.filter(
    (p) => p.availability === "in-stock" || p.availability === "low-stock",
  );
  const preOrderProducts = cartProducts.filter(
    (p) => p.availability === "pre-order",
  );

  const totalItems = cartProducts.reduce((sum, p) => sum + p.quantity, 0);
  const subtotal = cartProducts.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0,
  );
  const discount = cartProducts.reduce((sum, p) => {
    if (p.oldPrice) {
      return sum + (p.oldPrice - p.price) * p.quantity;
    }
    return sum;
  }, 0);

  if (cartProducts.length === 0) {
    return (
      <div className="flex min-h-full flex-col">
        <Container className="overflow-x-hidden">
          <Breadcrumb items={BREADCRUMB_ITEMS} />
        </Container>

        <Container
          className="flex flex-1 flex-col items-center justify-center
            text-center"
        >
          <BagIcon className="text-disabled mb-4 size-16" />
          <Text
            size="lg"
            className="font-semibold"
          >
            Корзина пуста
          </Text>
          <Text
            size="sm"
            variant="secondary"
            className="mt-2"
          >
            Добавьте товары из каталога, чтобы оформить заказ
          </Text>
        </Container>

        <div className="mt-auto">
          <Footer variant="default" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Container className="overflow-x-hidden">
        <Breadcrumb items={BREADCRUMB_ITEMS} />
      </Container>

      <Container className="sm:mt-6">
        <div className="flex gap-8">
          {/* Main content */}
          <div className="min-w-0 flex-1">
            {/* Header — desktop only, mobile has it in the app header */}
            <div className="hidden items-center gap-3 sm:flex">
              <Heading size="lg">Корзина</Heading>
              <Chip
                variant="outline-default"
                size="sm"
                rounded="full"
              >
                {pluralizeItems(totalItems)}
              </Chip>
            </div>

            {/* In-stock group */}
            {inStockProducts.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center gap-2">
                  <Box className="bg-success-500 size-2 rounded-full" />
                  <Text
                    size="sm"
                    className="font-medium"
                  >
                    В наличии
                  </Text>
                  <Text
                    size="sm"
                    variant="secondary"
                  >
                    {pluralizeItems(inStockProducts.reduce((s, p) => s + p.quantity, 0))}
                  </Text>
                </div>

                <div className="mt-3 space-y-3">
                  {inStockProducts.map((product) => (
                    <CartItem
                      key={product.id}
                      product={product}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Pre-order group */}
            {preOrderProducts.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center gap-2">
                  <Box className="bg-warning-500 size-2 rounded-full" />
                  <Text
                    size="sm"
                    className="font-medium"
                  >
                    Под заказ
                  </Text>
                  <Text
                    size="sm"
                    variant="secondary"
                  >
                    {pluralizeItems(preOrderProducts.reduce((s, p) => s + p.quantity, 0))}
                  </Text>
                  <span
                    className="text-secondary-500 ml-1 rounded-md bg-[#FDEAF0]
                      px-3 py-1.5 text-xs font-semibold"
                  >
                    Ожидание 15 – 20 дней
                  </span>
                </div>

                <div className="mt-3 space-y-3">
                  {preOrderProducts.map((product) => (
                    <CartItem
                      key={product.id}
                      product={product}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order summary sidebar — desktop only */}
          <div className="hidden w-85 shrink-0 lg:block">
            <div className="sticky top-6">
              <CartSummary
                totalItems={totalItems}
                subtotal={subtotal + discount}
                discount={discount}
              />
            </div>
          </div>
        </div>
      </Container>

      {/* Mobile order summary */}
      <Container className="mt-8 lg:hidden">
        <CartSummary
          totalItems={totalItems}
          subtotal={subtotal + discount}
          discount={discount}
        />
      </Container>

      <div className="mt-20">
        <Footer variant="default" />
      </div>
    </>
  );
}
