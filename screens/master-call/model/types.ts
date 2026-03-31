export type MasterCallStep = 0 | 1 | 2 | 3;

export type ServiceType = "repair" | "installation";

export type ApplianceCategory = {
  key: string;
  label: string;
};

export type TimeSlot = {
  key: string;
  start: string;
  end: string;
  available: boolean;
};

export type TimeSlotGroup = {
  key: string;
  label: string;
  slots: TimeSlot[];
};
