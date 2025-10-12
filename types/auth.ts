export type Role = "owner" | "supervisor" | "employee"

export interface OwnerSignupForm {
  firstName: string
  lastName: string
  companyName: string
  companyEmail: string
  phone: string
  password: string
  confirmPassword: string
  terms: boolean
}

export interface LoginForm {
  email: string
  password: string
  rememberMe?: boolean
}

