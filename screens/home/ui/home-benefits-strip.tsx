"use client";
import { HOME_BENEFITS } from "@/screens/home/model/benefits";
import { Container, HStack } from "@/shared/ui/kit";
import Image from "next/image";

export function HomeBenefitsStrip() {
  return (
    <Container>
      <HStack
        className="flex-wrap justify-center"
        gap={8}
      >
        {HOME_BENEFITS.map((benefit) => (
          <HStack
            key={benefit.key}
            className="items-center rounded-full px-4 py-2"
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
    </Container>
  );
}
