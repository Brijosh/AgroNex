import { z } from "zod";

export const FarmSchema = z.object({
  locationName: z.string().min(2, "Location is required (minimum 2 characters)"),
  area: z.coerce.number().positive("Land area must be a positive number").max(10000, "Unreasonably large area"),
  areaUnit: z.enum(["acres", "hectares"]).default("acres"),
  soilType: z.enum([
    "Sandy", "Loamy", "Clay", "Silty", "Black soil", "Red soil", "Laterite", "Unknown"
  ]).default("Loamy"),
  waterAvailability: z.enum([
    "Very Low", "Low", "Moderate", "High", "Very High"
  ]).default("Moderate"),
  irrigationType: z.enum([
    "Rainfed", "Drip", "Sprinkler", "Flood", "Other", "Unknown"
  ]).default("Rainfed"),
  season: z.enum([
    "Kharif", "Rabi", "Summer", "Year-round"
  ]).default("Kharif"),
  preferences: z.object({
    lowRisk: z.boolean().optional(),
    highProfit: z.boolean().optional(),
    lowWater: z.boolean().optional(),
    shortDuration: z.boolean().optional(),
  }).optional(),
});
