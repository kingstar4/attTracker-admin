"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"

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

const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
})

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { forgotPassword, loading, error, success, successMessage, clearForgotPasswordState } =
    usePasswordRecoveryStore()
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    return () => {
      clearForgotPasswordState()
    }
  }, [clearForgotPasswordState])

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onTouched",
  })

  const onSubmit = async (values: ForgotPasswordValues) => {
    try {
      await forgotPassword(values.email)
      setSubmitted(true)
      toast({
        title: "Email sent",
        description: "Check your email for password reset instructions",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: (err as Error)?.message ?? "Failed to send reset email",
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
            <h1 className="text-2xl font-semibold">Check your email</h1>
            <p className="text-sm text-muted-foreground">
              We've sent a password reset link to your email address. Click the link in the email
              to reset your password.
            </p>
          </div>

          <Alert>
            <Mail className="h-4 w-4" />
            <AlertTitle>Didn't receive the email?</AlertTitle>
            <AlertDescription>
              Check your spam folder or try requesting a new reset link.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Button
              onClick={() => {
                setSubmitted(false)
                form.reset()
              }}
              variant="outline"
              className="w-full"
            >
              Send another email
            </Button>
            <Button onClick={() => router.push("/login")} className="w-full">
              Back to login
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-md px-4 py-10">
      <div className="mb-6 flex items-center gap-2">
        <Mail className="h-6 w-6" />
        <h1 className="text-xl font-semibold">Reset password</h1>
      </div>

      <p className="mb-6 text-sm text-muted-foreground">
        Enter your email address and we'll send you a link to reset your password.
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Sending..." : "Send reset link"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/login")}
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Button>
        </form>
      </Form>
    </div>
  )
}
