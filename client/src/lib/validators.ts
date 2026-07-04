import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .email("Invalid email")
    .regex(/@thapar\.edu$/, "Must be a Thapar college email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  branch: z.string().min(1, "Branch is required"),
  year: z.coerce.number().min(1).max(5),
  gender: z.enum(["male", "female", "other"]),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

// The shape BEFORE validation runs (what the form fields actually hold)
export type SignupFormInput = z.input<typeof signupSchema>;

// The shape AFTER validation/coercion (what you get in onSubmit)
export type SignupFormData = z.output<typeof signupSchema>;