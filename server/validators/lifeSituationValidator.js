import { z } from "zod";

export const lifeSituationSchema = z.object({
  intent: z.object({
    primary: z.enum([
      "SCHOLARSHIP",
      "FARMING",
      "EMPLOYMENT",
      "BUSINESS",
      "HOUSING",
      "HEALTH",
      "GENERAL_BENEFIT",
      "UNKNOWN",
    ]),
  }),

  situationSummary: z.string().min(1).max(500),

  extractedProfileSignals: z.object({
    age: z.number().int().min(1).max(120).nullable().default(null),
    gender: z.string().nullable().default(null),
    category: z.string().nullable().default(null),
    differentlyAbled: z.boolean().nullable().default(null),

    state: z.string().nullable().default(null),
    district: z.string().nullable().default(null),

    qualification: z.string().nullable().default(null),
    currentCourse: z.string().nullable().default(null),
    institution: z.string().nullable().default(null),

    occupationType: z.string().nullable().default(null),
    annualIncome: z.number().nonnegative().nullable().default(null),

    isFarmer: z.boolean().nullable().default(null),
    landholdingAcres: z.number().nonnegative().nullable().default(null),
    cropTypes: z.array(z.string()).default([]),

    needs: z.array(z.string()).default([]),
  }),

  missingInformation: z.array(z.string()).default([]),

  confidence: z.enum(["HIGH", "MEDIUM", "LOW"]),
});

export const inputAnalyzeSchema = z.object({
  text: z
    .string()
    .trim()
    .min(3, "Text must be at least 3 characters long.")
    .max(2000, "Text cannot exceed 2000 characters."),
});

export const applySignalsSchema = z.object({
  proposedSignals: z.object({
    age: z.number().int().min(1).max(120).nullable().optional(),
    gender: z.string().nullable().optional(),
    category: z.string().nullable().optional(),
    differentlyAbled: z.boolean().nullable().optional(),
    state: z.string().nullable().optional(),
    district: z.string().nullable().optional(),
    qualification: z.string().nullable().optional(),
    occupationType: z.string().nullable().optional(),
    annualIncome: z.number().nonnegative().nullable().optional(),
    isFarmer: z.boolean().nullable().optional(),
    landholdingAcres: z.number().nonnegative().nullable().optional(),
    cropTypes: z.array(z.string()).optional(),
    needs: z.array(z.string()).optional(),
  }),
});
