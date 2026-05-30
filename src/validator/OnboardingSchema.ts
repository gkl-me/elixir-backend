import { z } from "zod";
import { CompanySchema } from "./CompanySchema";

export const OnboardingStateSchema = z
  .object({
    currentStep: z.number().min(1),

    isCompleted: z.boolean(),

    planType: z.enum(["Free", "Pro", "Enterprice"]),

    planId: z.string().trim().min(1),

    planPrice: z.number().min(0),

    workspaceName: z
      .string()
      .trim()
      .min(2, "Workspace name must be at least 2 characters"),

    company: CompanySchema,
  })
  .partial(); 