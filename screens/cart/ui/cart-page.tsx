"use client";

import { useEffect, useState } from "react";
import { BagIcon } from "@/shared/icons";
import { useCartStore } from "@/shared/lib/stores";
import { Box, Breadcrumb, Chip, Container, Heading, Text } from "@/shared/ui/kit";
import { Footer } from "@/widgets/footer";
import { MOCK_PRODUCTS } from "@/screens/catalog/model";
import type { Product } from "@/screens/catalog/model";
import { MOCK_CART_ITEMS } from "../model";
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

function formatPrice(price: number): string {
  return price.toLocaleString("ru-RU");
}

export function CartPage() {
  const cartItems = useCartStore((s) => s.items);
  const [seeded, setSeeded] = useState(false);

  // Seed mock data on first mount if cart is empty
  useEffect(() => {
    if (seeded) return;
    if (cartItems.size === 0) {
      const store = useCartStore.getState();
      for (const [id, qty] of MOCK_CART_ITEMS) {
        const current = new Map(useCartStore.getState().items);
        current.set(id, qty);
        useCartStore.setState({ items: current });
      }
    }
    setSeeded(true);
  }, [seeded, cartItems.size]);

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

        <Container className="flex flex-1 flex-col items-center justify-center text-center">
          <BagIcon className="mb-4 size-16 text-disabled" />
          <Text size="lg" className="font-semibold">
            Корзина пуста
          </Text>
          <Text size="sm" variant="secondary" className="mt-2">
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

      <Container className="mt-6">
        <div className="flex gap-8">
          {/* Main content */}
          <div className="min-w-0 flex-1">
            {/* Header */}
            <div className="flex items-center gap-3">
              <Heading size="lg">Корзина</Heading>
              <Chip variant="outline-default" size="sm" rounded="full">
                {pluralizeItems(totalItems)}
              </Chip>
            </div>

            {/* In-stock group */}
            {inStockProducts.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center gap-2">
                  <Box className="size-2 rounded-full bg-success-500" />
                  <Text size="sm" className="font-medium">
                    В наличии
                  </Text>
                  <Text size="sm" variant="secondary">
                    {pluralizeItems(inStockProducts.length)}
                  </Text>
                </div>

                <div className="mt-3 space-y-3">
                  {inStockProducts.map((product) => (
                    <CartItem key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}

            {/* Pre-order group */}
            {preOrderProducts.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center gap-2">
                  <Box className="size-2 rounded-full bg-warning-500" />
                  <Text size="sm" className="font-medium">
                    Под заказ
                  </Text>
                  <Text size="sm" variant="secondary">
                    {pluralizeItems(preOrderProducts.length)}
                  </Text>
                  <Chip
                    variant="outline-default"
                    size="sm"
                    rounded="md"
                    className="ml-1 border-warning-500/30 text-warning-700"
                  >
                    Срок доставки 15 – 20 дней
                  </Chip>
                </div>

                <div className="mt-3 space-y-3">
                  {preOrderProducts.map((product) => (
                    <CartItem key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order summary sidebar — desktop only */}
          <div className="hidden w-72 shrink-0 lg:block">
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
