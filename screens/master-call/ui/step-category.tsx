import { useState } from "react";

import {
  Box,
  Breadcrumb,
  Button,
  Chip,
  Container,
  Heading,
  SheetFooterSlot,
  Text,
} from "@/shared/ui/kit";
import { APPLIANCE_CATEGORIES } from "../model/categories";
import type { ApplianceCategory, ServiceType } from "../model/types";

const SERVICE_TYPE_OPTIONS: { value: ServiceType; label: string }[] = [
  { value: "repair", label: "Ремонт" },
  { value: "installation", label: "Установка" },
];

const QUESTION_BY_SERVICE_TYPE: Record<ServiceType, string> = {
  repair: "Что нужно отремонтировать?",
  installation: "Что нужно установить?",
};

type StepCategoryProps = {
  serviceType: ServiceType;
  onServiceTypeChange: (type: ServiceType) => void;
  selectedCategory: ApplianceCategory | null;
  onSelectCategory: (category: ApplianceCategory) => void;
  onNext: () => void;
};

export function StepCategory({
  serviceType,
  onServiceTypeChange,
  selectedCategory,
  onSelectCategory,
  onNext,
}: StepCategoryProps) {
  const [submitted, setSubmitted] = useState(false);

  const handleNext = () => {
    setSubmitted(true);
    if (selectedCategory) {
      onNext();
    }
  };

  return (
    <Container className="flex flex-col gap-10">
      <Breadcrumb
        items={[{ label: "Сервис", href: "/" }, { label: "Вызвать мастера" }]}
      />

      <Heading
        size="xl"
        className="hidden sm:block"
      >
        Вызвать мастера
      </Heading>

      <Box className="flex flex-col gap-6">
        <Heading size="lg">Вид услуги</Heading>
        <Box className="flex flex-wrap items-start gap-3 sm:gap-6">
          {SERVICE_TYPE_OPTIONS.map((option) => (
            <Chip
              key={option.value}
              size="lg"
              selected={serviceType === option.value}
              onClick={() => onServiceTypeChange(option.value)}
            >
              {option.label}
            </Chip>
          ))}
        </Box>
      </Box>

      <Box className="flex flex-col gap-6">
        <Heading size="lg">{QUESTION_BY_SERVICE_TYPE[serviceType]}</Heading>
        <Box className="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:gap-6">
          {APPLIANCE_CATEGORIES.map((category) => (
            <Chip
              key={category.key}
              size="lg"
              selected={selectedCategory?.key === category.key}
              onClick={() => onSelectCategory(category)}
            >
              {category.label}
            </Chip>
          ))}
        </Box>
      </Box>

      <SheetFooterSlot>
        <Box className="shadow-primary-900/15 flex items-center justify-end gap-3 rounded-t-[24px] bg-[#F7FAFF] px-4 py-4 shadow-[0_-0px_60px_-0px]">
          {submitted && !selectedCategory && (
            <Text
              variant="error"
              size="sm"
            >
              Выберите категорию поломки
            </Text>
          )}
          <Button onClick={handleNext}>Продолжить</Button>
        </Box>
      </SheetFooterSlot>
    </Container>
  );
}
