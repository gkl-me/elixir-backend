import {z} from 'zod'

export const RegisterSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name cannot exceed 100 characters")
    .regex(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces")
    .refine((val) => val.trim().length > 0, {
      message: "Name cannot be empty or spaces only",
    }),

  email: z
    .string()
    .trim()
    .email({
      message: "Invalid email address",
    })
    .refine((val) => !/\s/.test(val), {
      message: "Email cannot contain spaces",
    }),

  password: z
    .string()
    .trim()
    .min(8, "Password should be at least 8 characters long")
    .max(100, "Password cannot exceed 100 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[@$!%*?&]/, "Password must contain at least one special character (@$!%*?&)")
    .refine((val) => !/\s/.test(val), {
      message: "Password cannot contain spaces",
    }),
    confirmPassword: z
      .string()
      .trim()
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.confirmPassword !== undefined && data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
});

export const LoginSchema = z.object({
  email: z
    .string()
    .trim()
    .email({
      message: "Invalid email address",
    })
    .refine((val) => !/\s/.test(val), {
      message: "Email cannot contain spaces",
    }),

  password: z
    .string()
    .trim()
    .min(8, "Password should be at least 8 characters long")
    .max(100, "Password cannot exceed 100 characters")
    .refine((val) => !/\s/.test(val), {
      message: "Password cannot contain spaces",
    }),
});