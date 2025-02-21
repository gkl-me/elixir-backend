import { z } from "zod";

export const createSubscriptionSchema = z.object({
  name: z
    .string()
    .min(3, "Name should be min 3 charachter")
    .max(100, "Name should not exceed 100 charachter"),
  type: z.enum(["user", "company"], {
    message: "Must be a user or a company",
  }),
  price: z.number().positive({ message: "Price should be a number" }),

  cycle: z.enum(["monthly", "quarterly", "annually"], {
    message: "Must be a monthly, quarterly or annually",
  }),
  features: z.array(z.string().min(3).max(100)).nonempty(),
  maxTeams: z
    .number()
    .int({ message: "Number of teams should be number" })
    .positive({ message: "Number of teams should be a number" }),
  maxProjects: z
    .number()
    .int({ message: "Number of projects should be number" })
    .positive({ message: "Number of projects should be a number" }),
});


export const updateSubscriptionSchema = createSubscriptionSchema.partial()
