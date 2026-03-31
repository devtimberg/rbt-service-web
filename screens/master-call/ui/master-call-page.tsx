"use client";

import { useMemo, useState } from "react";
import type {
  ApplianceCategory,
  MasterCallStep,
  ServiceType,
  TimeSlot,
  TimeSlotGroup,
} from "../model/types";
import { getTimeSlotGroups } from "../model/time-slots";
import { StepCategory } from "./step-category";
import { StepTimeSlot } from "./step-time-slot";
import { StepConfirmation } from "./step-confirmation";
import { StepSuccess } from "./step-success";

export function MasterCallPage() {
  const [step, setStep] = useState<MasterCallStep>(0);
  const [serviceType, setServiceType] = useState<ServiceType>("repair");
  const [category, setCategory] = useState<ApplianceCategory | null>(null);
  const [selected, setSelected] = useState<{
    group: TimeSlotGroup;
    slot: TimeSlot;
  } | null>(null);

  const timeSlotGroups = useMemo(() => getTimeSlotGroups(), []);

  const handleSelectCategory = (cat: ApplianceCategory) => {
    setCategory((prev) => (prev?.key === cat.key ? null : cat));
  };

  const handleNext = () => {
    if (category) {
      setStep(1);
    }
  };

  const handleSelectSlot = (group: TimeSlotGroup, slot: TimeSlot) => {
    setSelected({ group, slot });
  };

  const handleBack = () => {
    setStep((prev) => (prev > 0 ? ((prev - 1) as MasterCallStep) : prev));
  };

  switch (step) {
    case 0:
      return (
        <StepCategory
          serviceType={serviceType}
          onServiceTypeChange={setServiceType}
          selectedCategory={category}
          onSelectCategory={handleSelectCategory}
          onNext={handleNext}
        />
      );
    case 1:
      return (
        <StepTimeSlot
          groups={timeSlotGroups}
          selected={selected}
          onSelect={handleSelectSlot}
          onNext={() => setStep(2)}
          onBack={handleBack}
        />
      );
    case 2:
      return (
        <StepConfirmation
          serviceType={serviceType}
          category={category!}
          selectedGroup={selected!.group}
          selectedSlot={selected!.slot}
          onCancel={handleBack}
        />
      );
    case 3:
      return <StepSuccess />;
  }
}
