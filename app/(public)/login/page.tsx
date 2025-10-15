"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Eye, EyeOff, LogIn } from "lucide-react"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useAuthStore } from "@/store/useAuthStore"

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional().default(false),
})

type LoginValues = z.infer<typeof loginSchema>

const roleRedirectMap = {
  owner: "/roles/owner/dashboard",
  supervisor: "/roles/supervisor/dashboard",
  employee: "/roles/employee/dashboard",
} as const

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { login, loading } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
    mode: "onTouched",
  })

  const onSubmit = async (values: LoginValues) => {
    try {
      const user = await login(values.email, values.password, values.rememberMe)
      toast({ title: "Logged in", description: `Welcome back, ${user.firstName ?? "user"}!` })
      router.push(roleRedirectMap[user.role])
    } catch (err) {
      toast({ title: "Login failed", description: (err as Error)?.message ?? "Unknown error" })
    }
  }

  return (
    <div className="container mx-auto max-w-md px-4 py-10">
      <div className="mb-6 flex items-center gap-2">
        <LogIn className="h-6 w-6" />
        <h1 className="text-xl font-semibold">Sign in</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" autoComplete="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type={showPassword ? "text" : "password"} autoComplete="current-password" {...field} />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <Checkbox checked={field.value} onCheckedChange={(v) => field.onChange(Boolean(v))} />
                    <FormLabel className="font-normal">Remember me</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="text-sm text-primary underline-offset-2 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

