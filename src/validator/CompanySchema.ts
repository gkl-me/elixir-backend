import { z } from "zod";

export const CompanySchema = z.object({
  name: z.string().trim().min(2, "Company name is required").max(150),

  type: z.string().trim().min(1, "Please select company type"),

  size: z
    .number({
      invalid_type_error: "Company size must be a number",
    })
    .min(1, "Company size must be greater than 0"),

  email: z.string().trim().email("Invalid company email"),

  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-() ]{7,20}$/, "Invalid phone number"),

  workspaceName: z
    .string()
    .trim()
    .min(2, "Workspace name must be at least 2 characters")
    .optional(),
});
