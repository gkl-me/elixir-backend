import { z } from "zod";
import { CompanySchema } from "./CompanySchema";
import { PlanType } from "../models/Plan";

export const OnboardingStateSchema = z
  .object({
    currentStep: z.number().min(1),

    isCompleted: z.boolean(),

    planType: z.nativeEnum(PlanType),

    planId: z.string().trim().min(1),

    planPrice: z.number().min(0),

    workspaceName: z
      .string()
      .trim()
      .min(2, "Workspace name must be at least 2 characters"),

    company: CompanySchema,
  })
  .partial();
