"use client";
import { HOME_BENEFITS } from "@/screens/home/model/benefits";
import { Container, HStack } from "@/shared/ui/kit";
import Image from "next/image";

export function HomeBenefitsStrip() {
  // Отдельный benefit с номером телефона для мобильного блока "Бесплатный звонок".
  const callBenefit = HOME_BENEFITS.find((benefit) => benefit.key === "call");
  // Остальные преимущества, которые рендерятся в сетке/строках.
  const regularBenefits = HOME_BENEFITS.filter(
    (benefit) => benefit.key !== "call",
  );
  // Разбиение списка для md..xl: первая строка (3 элемента), вторая строка (2 элемента).
  const desktopFirstRow = HOME_BENEFITS.slice(0, 3);
  const desktopSecondRow = HOME_BENEFITS.slice(3);

  return (
    <Container>
      {/* Мобильный блок "Бесплатный звонок" (виден только до md). */}
      {callBenefit ? (
        <div
          className="bg-primary-300 mb-8 flex w-full items-center justify-center
            gap-3 rounded-3xl px-6 py-5 md:hidden"
        >
          <Image
            src={callBenefit.iconSrc}
            alt=""
            width={40}
            height={40}
            className="block"
            aria-hidden
          />
          <span
            className="text-inverse text-[16px] leading-tight font-semibold
              whitespace-pre-wrap"
          >
            {callBenefit.text}
          </span>
        </div>
      ) : null}

      {/* Мобильная сетка преимуществ 2x2 без call-элемента. */}
      <div
        className="text-inverse mx-auto grid w-max
          grid-cols-[repeat(2,max-content)] gap-x-8 gap-y-10 md:hidden"
      >
        {regularBenefits.map((benefit) => (
          <HStack
            key={benefit.key}
            className="items-center"
            gap={2}
          >
            <Image
              src={benefit.iconSrc}
              alt=""
              width={32}
              height={32}
              className="block"
              aria-hidden
            />
            <span
              className="text-inverse text-[12px] font-medium
                whitespace-pre-wrap"
            >
              {benefit.text}
            </span>
          </HStack>
        ))}
      </div>

      {/* Планшет/небольшой desktop: преимущества в две строки для лучшей читаемости. */}
      <div className="hidden md:block xl:hidden">
        <HStack
          className="justify-center"
          gap={10}
        >
          {desktopFirstRow.map((benefit) => (
            <HStack
              key={benefit.key}
              className="items-center"
              gap={2}
            >
              <Image
                src={benefit.iconSrc}
                alt=""
                width={48}
                height={48}
                className="block"
                aria-hidden
              />
              <span
                className="text-inverse text-[14px] font-medium
                  whitespace-pre-wrap"
              >
                {benefit.text}
              </span>
            </HStack>
          ))}
        </HStack>
        <HStack
          className="mt-6 justify-center"
          gap={10}
        >
          {desktopSecondRow.map((benefit) => (
            <HStack
              key={benefit.key}
              className="items-center"
              gap={2}
            >
              <Image
                src={benefit.iconSrc}
                alt=""
                width={48}
                height={48}
                className="block"
                aria-hidden
              />
              <span
                className="text-inverse text-[14px] font-medium
                  whitespace-pre-wrap"
              >
                {benefit.text}
              </span>
            </HStack>
          ))}
        </HStack>
      </div>

      {/* Широкий desktop (xl+): один центрированный ряд из 5 элементов. */}
      <div
        className="hidden xl:mx-auto xl:grid xl:w-max
          xl:grid-cols-[repeat(5,max-content)] xl:gap-x-10"
      >
        {HOME_BENEFITS.map((benefit) => (
          <HStack
            key={benefit.key}
            className="items-center"
            gap={2}
          >
            <Image
              src={benefit.iconSrc}
              alt=""
              width={48}
              height={48}
              className="block"
              aria-hidden
            />
            <span
              className="text-inverse text-[14px] font-semibold
                whitespace-pre-wrap"
            >
              {benefit.text}
            </span>
          </HStack>
        ))}
      </div>
    </Container>
  );
}
