"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Eye, EyeOff, KeyRound, CheckCircle, AlertCircle } from "lucide-react"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { usePasswordRecoveryStore } from "@/store/usePasswordRecoveryStore"

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { resetPassword, loading, error, success, successMessage, clearResetPasswordState } =
    usePasswordRecoveryStore()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const token = searchParams.get("token")

  useEffect(() => {
    if (!token) {
      toast({
        title: "Invalid link",
        description: "The password reset link is invalid or has expired",
        variant: "destructive",
      })
      router.push("/login")
    }

    return () => {
      clearResetPasswordState()
    }
  }, [token, router, toast, clearResetPasswordState])

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onTouched",
  })

  const onSubmit = async (values: ResetPasswordValues) => {
    if (!token) {
      toast({
        title: "Error",
        description: "Reset token is missing",
        variant: "destructive",
      })
      return
    }

    try {
      await resetPassword(token, values.password, values.confirmPassword)
      setSubmitted(true)
      toast({
        title: "Success",
        description: "Your password has been reset successfully",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: (err as Error)?.message ?? "Failed to reset password",
        variant: "destructive",
      })
    }
  }

  if (submitted && success) {
    return (
      <div className="container mx-auto max-w-md px-4 py-10">
        <div className="space-y-6">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>

          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold">Password reset successful</h1>
            <p className="text-sm text-muted-foreground">
              Your password has been reset successfully. You can now log in with your new password.
            </p>
          </div>

          <Button onClick={() => router.push("/login")} className="w-full">
            Go to login
          </Button>
        </div>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="container mx-auto max-w-md px-4 py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Invalid reset link</AlertTitle>
          <AlertDescription>
            The password reset link is invalid or has expired. Please request a new one.
          </AlertDescription>
        </Alert>
        <Button onClick={() => router.push("/forgot-password")} className="mt-4 w-full">
          Request new reset link
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-md px-4 py-10">
      <div className="mb-6 flex items-center gap-2">
        <KeyRound className="h-6 w-6" />
        <h1 className="text-xl font-semibold">Create new password</h1>
      </div>

      <p className="mb-6 text-sm text-muted-foreground">
        Enter a new password for your account. Make sure it's strong and unique.
      </p>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      autoComplete="new-password"
                      disabled={loading}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      autoComplete="new-password"
                      disabled={loading}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
            <p className="font-semibold mb-2">Password requirements:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>At least 8 characters</li>
              <li>At least one uppercase letter</li>
              <li>At least one lowercase letter</li>
              <li>At least one number</li>
            </ul>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Resetting..." : "Reset password"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/login")}
            className="w-full"
          >
            Back to login
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="container mx-auto max-w-md px-4 py-10">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
