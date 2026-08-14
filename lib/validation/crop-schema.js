import { z } from "zod";

export const CropSchema = z.object({
  name: z.string().min(1, "Crop name is required"),
  season: z.string(),
  suitableSoils: z.array(z.string()).min(1, "At least one suitable soil required"),
  waterRequirement: z.string(),
  minTemperature: z.number(),
  maxTemperature: z.number(),
  averageYieldPerHectare: z.number().positive(),
  cultivationCostPerHectare: z.number().nonnegative(),
  referenceMarketPrice: z.number().positive(),
  durationDays: z.number().positive(),
  baseRisk: z.number().min(0).max(100),
  marketVolatility: z.number().min(0).max(100),
});
