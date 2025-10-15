"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, CheckCircle2, AlertTriangle } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/useAuthStore";

const passwordSchema = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[A-Z]/, "At least one uppercase letter")
  .regex(/[0-9]/, "At least one number")
  .regex(/[^A-Za-z0-9]/, "At least one special character");

const acceptSchema = z
  .object({
    email: z.string().email(),
    password: passwordSchema,
    confirm_password: z.string(),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: "Passwords must match",
    path: ["confirm_password"],
  });

type AcceptValues = z.infer<typeof acceptSchema>;

type ValidateResponse =
  | {
      valid: true;
      user: {
        email: string;
        firstName: string;
        lastName: string;
        role: "supervisor" | "employee";
        companyName: string;
      };
    }
  | { valid: false; message: string };

function InviteAcceptContent() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const router = useRouter();
  const { toast } = useToast();
  const { setUser } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invite, setInvite] = useState<ValidateResponse | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<AcceptValues>({
    resolver: zodResolver(acceptSchema),
    defaultValues: { email: "", password: "", confirm_password: "" },
    mode: "onTouched",
  });

  const roleRedirectMap = useMemo(
    () =>
      ({
        supervisor: "/roles/supervisor/dashboard",
        employee: "/roles/employee/dashboard",
      }) as const,
    []
  );

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!token) {
        setError("Missing invitation token");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await fetch(
          `/api/invitations/validate?token=${encodeURIComponent(token)}`
        );
        if (!res.ok) throw new Error("Failed to validate invitation");
        const data: ValidateResponse = await res.json();
        if (!cancelled) {
          setInvite(data);
          if (data.valid) {
            form.reset({
              email: data.user.email,
              password: "",
              confirm_password: "",
            });
          } else {
            setError(data.message || "Invalid or expired invitation link");
          }
        }
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [token, form]);

  const onSubmit = async (values: AcceptValues) => {
    try {
      const res = await fetch("/api/invitations/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          confirm_password: values.confirm_password,
        }),
      });
      if (!res.ok) throw new Error("Failed to accept invitation");
      const data: {
        success: boolean;
        message: string;
        role: "supervisor" | "employee";
        token: string;
      } = await res.json();
      toast({ title: "Success", description: data.message });
      setUser({
        id: "inv-" + Math.random().toString(36).slice(2),
        email: values.email,
        role: data.role,
        token: data.token,
      });
      router.push(roleRedirectMap[data.role]);
    } catch (e) {
      toast({ title: "Error", description: (e as Error).message });
    }
  };

  return (
    <div className="container mx-auto max-w-xl px-4 py-10">
      <Card className="p-6">
        <h1 className="text-xl font-semibold">Accept Invitation</h1>
        <p className="text-sm text-muted-foreground">
          Set your password to finish account setup.
        </p>

        {loading ? (
          <div className="mt-6 space-y-3">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
        ) : error ? (
          <div className="mt-6 flex items-start gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <p className="text-sm">{error}</p>
          </div>
        ) : invite && invite.valid ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-6 grid gap-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly className="bg-muted" />
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
                        <Input
                          type={showPass ? "text" : "password"}
                          placeholder="password123"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPass((v) => !v)}
                        >
                          {showPass ? (
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
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirm ? "text" : "password"}
                          placeholder="password123"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => setShowConfirm((v) => !v)}
                        >
                          {showConfirm ? (
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

              <Button type="submit" className="w-full">
                <CheckCircle2 className="mr-2 h-4 w-4" /> Accept Invite
              </Button>
            </form>
          </Form>
        ) : null}
      </Card>
    </div>
  );
}

export default function InviteAcceptPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto max-w-xl px-4 py-10">
          <Card className="p-6">
            <Skeleton className="h-7 w-48 mb-2" />
            <Skeleton className="h-4 w-64 mb-6" />
            <div className="space-y-3">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
          </Card>
        </div>
      }
    >
      <InviteAcceptContent />
    </Suspense>
  );
}
