import { z } from "zod"

export interface Employee {
  id: string
  first_name: string
  last_name: string
  email: string
  phone_number: string
  address: string
  nin: string
  emergency_contact_name: string
  emergency_contact_phone: string
  is_active: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateEmployeeDto {
  email: string
  first_name: string
  last_name: string
  nin: string
  phone_number: string
  address: string
  emergency_contact_name: string
  emergency_contact_phone: string
}

export const employeeFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  nin: z.string().min(11, "NIN must be at least 11 characters"),
  phone_number: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  emergency_contact_name: z.string().min(2, "Emergency contact name must be at least 2 characters"),
  emergency_contact_phone: z.string().min(10, "Emergency contact phone must be at least 10 digits"),
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