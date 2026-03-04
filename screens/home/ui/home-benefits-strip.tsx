"use client";
import { HOME_BENEFITS } from "@/screens/home/model/benefits";
import { Container, HStack } from "@/shared/ui/kit";
import Image from "next/image";

export function HomeBenefitsStrip() {
  const callBenefit = HOME_BENEFITS.find((benefit) => benefit.key === "call");
  const regularBenefits = HOME_BENEFITS.filter(
    (benefit) => benefit.key !== "call",
  );
  const desktopFirstRow = HOME_BENEFITS.slice(0, 3);
  const desktopSecondRow = HOME_BENEFITS.slice(3);
  const callBenefitParts = callBenefit?.text.split("\n") ?? [];

  return (
    <Container>
      {callBenefit ? (
        <a
          href="tel:+78003335556"
          className="bg-primary-300 text-primary mb-8 flex w-full items-center justify-center gap-2 rounded-3xl px-6 py-5 md:hidden"
        >
          <span className="shrink-0">
            <Image
              src={callBenefit.iconSrc}
              alt=""
              width={32}
              height={32}
              className="block"
              aria-hidden
            />
          </span>
          <span className="text-sm leading-tight">
            {callBenefitParts[0]}
            {callBenefitParts[1] ? (
              <>
                {" "}
                <span className="whitespace-nowrap">{callBenefitParts[1]}</span>
              </>
            ) : null}
          </span>
        </a>
      ) : null}

      <div className="xs:px-0 grid grid-cols-2 gap-x-8 gap-y-10 sm:px-6 md:hidden">
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
            <span className="text-primary text-[12px] font-medium whitespace-pre-wrap">
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
              <span className="text-primary font-medium whitespace-pre-wrap">
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
              <span className="text-primary font-medium whitespace-pre-wrap">
                {benefit.text}
              </span>
            </HStack>
          ))}
        </HStack>
      </div>

      <div className="hidden xl:mx-auto xl:grid xl:w-max xl:grid-cols-[repeat(5,max-content)] xl:gap-x-10">
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
            <span className="text-primary text-[16px] font-semibold whitespace-pre-wrap">
              {benefit.text}
            </span>
          </HStack>
        ))}
      </div>
    </Container>
  );
}
