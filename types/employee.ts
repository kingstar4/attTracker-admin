import { z } from "zod"

export interface Employee {
  id: string
  name: string
  email: string
  phone: string
  address: string
  nin: string
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

export interface CreateEmployeeDto {
  name: string
  email: string
  phone: string
  address: string
  nin: string
}

export const employeeFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(11, "Phone number must be at least 11 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  nin: z.string().length(11, "NIN must be exactly 11 digits"),
})

export interface PasswordSetup {
  password: string
  confirmPassword: string
}

export const passwordSetupSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})