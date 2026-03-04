"use client";
import { HOME_BENEFITS } from "@/screens/home/model/benefits";
import { Container, HStack } from "@/shared/ui/kit";
import Image from "next/image";

export function HomeBenefitsStrip() {
  const callBenefit = HOME_BENEFITS.find((benefit) => benefit.key === "call");
  const regularBenefits = HOME_BENEFITS.filter((benefit) => benefit.key !== "call");
  const desktopFirstRow = HOME_BENEFITS.slice(0, 3);
  const desktopSecondRow = HOME_BENEFITS.slice(3);

  return (
    <Container>
      {callBenefit ? (
        <a
          href="tel:+78003335556"
          className="bg-primary-300 text-primary mb-8 flex w-full items-center gap-3 rounded-3xl px-6 py-5 md:hidden"
        >
          <Image
            src={callBenefit.iconSrc}
            alt=""
            width={48}
            height={48}
            className="block"
            aria-hidden
          />
          <span className="text-[22px] font-semibold leading-tight whitespace-pre-wrap">
            {callBenefit.text.replace("\n", " ")}
          </span>
        </a>
      ) : null}

      <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:hidden">
        {regularBenefits.map((benefit) => (
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
            <span className="text-primary text-sm font-medium whitespace-pre-wrap">
              {benefit.text}
            </span>
          </HStack>
        ))}
      </div>

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
              <span className="text-primary text-sm font-medium whitespace-pre-wrap">
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
              <span className="text-primary text-sm font-medium whitespace-pre-wrap">
                {benefit.text}
              </span>
            </HStack>
          ))}
        </HStack>
      </div>

      <div className="hidden grid-cols-5 gap-x-10 gap-y-8 xl:grid">
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
            <span className="text-primary text-sm font-medium whitespace-pre-wrap">
              {benefit.text}
            </span>
          </HStack>
        ))}
      </div>
    </Container>
  );
}
