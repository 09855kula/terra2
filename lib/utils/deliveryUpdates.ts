export const DELIVERY_UPDATE_STAGES = ["20min", "10min", "5min", "here"] as const;
export type DeliveryUpdateStage = (typeof DELIVERY_UPDATE_STAGES)[number];

export const DELIVERY_UPDATE_LABELS: Record<DeliveryUpdateStage, string> = {
  "20min": "20 min",
  "10min": "10 min",
  "5min": "5 min",
  here: "Here",
};
