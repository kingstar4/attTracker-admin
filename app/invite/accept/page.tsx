"use client";

import { Suspense, useEffect, useState } from "react";
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
import api from "@/lib/api";
import { navigation } from "@/config/navigate";
import {
  useAuthStore,
  type AuthUser,
  type UserRole,
} from "@/store/useAuthStore";

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
        role: UserRole;
        companyName: string;
      };
    }
  | { valid: false; message: string };

const INVITE_ACCEPT_ENDPOINT = "/invite/accept";

// Ensure we always fall back to a valid application role value
const normalizeRole = (role: unknown): UserRole => {
  if (typeof role === "string") {
    const value = role.toLowerCase();
    if (value === "supervisor") return "supervisor";
    if (value === "employee") return "employee";
  }
  return "employee";
};

// Redirect users to the first navigation entry for their role
const getRoleLandingPath = (role: UserRole) => {
  const items = navigation[role as keyof typeof navigation];
  return items?.[0]?.to ?? `/${role}`;
};

// Shape the validation payload from the API into a local structure
const mapValidateResponse = (payload: any): ValidateResponse => {
  const data = payload?.data ?? payload;
  const message = data?.message ?? payload?.message;
  const userData = data?.user ?? data?.invite ?? data;
  const valid =
    data?.valid ??
    (typeof userData?.email === "string" && userData.email.length > 0);

  if (!valid || !userData?.email) {
    return {
      valid: false,
      message: message ?? "Invalid or expired invitation link",
    };
  }

  return {
    valid: true,
    user: {
      email: userData.email,
      firstName: userData.firstName ?? userData.first_name ?? "",
      lastName: userData.lastName ?? userData.last_name ?? "",
      role: normalizeRole(userData.role ?? data?.role),
      companyName:
        userData.companyName ??
        userData.company_name ??
        data?.companyName ??
        "",
    },
  };
};

const extractAcceptPayload = (
  payload: any,
  fallbackEmail: string,
  fallbackRole: UserRole = "employee"
): { message: string; user: AuthUser } => {
  // Some responses wrap the actual data, so normalise first
  const data = payload?.data ?? payload;
  const userData = data?.user ?? data;
  const role = normalizeRole(userData?.role ?? data?.role ?? fallbackRole);
  const token =
    userData?.token ?? data?.token ?? data?.access_token ?? data?.authToken;

  const user: AuthUser = {
    id:
      userData?.id ??
      userData?._id ??
      `inv-${Math.random().toString(36).slice(2)}`,
    email: userData?.email ?? fallbackEmail,
    firstName: userData?.firstName ?? userData?.first_name,
    lastName: userData?.lastName ?? userData?.last_name,
    companyName:
      userData?.companyName ??
      userData?.company_name ??
      data?.companyName ??
      "",
    role,
    token,
  };

  return {
    message: data?.message ?? payload?.message ?? "Invitation accepted",
    user,
  };
};

// Strip useful error information from Axios/fetch errors
const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object") {
    const err = error as {
      response?: { data?: any; statusText?: string };
      message?: string;
    };
    if (err.response) {
      const respData = err.response.data;
      if (typeof respData === "string" && respData) return respData;
      if (respData?.message) return respData.message;
      if (respData?.error) return respData.error;
      if (err.response.statusText) return err.response.statusText;
    }
    if (err.message) return err.message;
  }
  if (typeof error === "string") return error;
  return "Unknown error";
};

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
        // Validate the invitation token before prompting for password
        const res = await api.get(INVITE_ACCEPT_ENDPOINT, {
          params: { token },
        });
        const data = mapValidateResponse(res.data);
        if (!cancelled) {
          setInvite(data);
          if (data.valid) {
            form.reset({
              email: data.user.email,
              password: "",
              confirm_password: "",
            });
            setError(null);
          } else {
            setError(data.message || "Invalid or expired invitation link");
          }
        }
      } catch (e) {
        if (!cancelled) setError(getErrorMessage(e));
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
    if (!token) {
      toast({
        title: "Error",
        description: "Missing invitation token",
      });
      return;
    }

    try {
      // Complete the invitation acceptance by creating a password
      const res = await api.post(INVITE_ACCEPT_ENDPOINT, {
        token,
        email: values.email,
        password: values.password,
        confirm_password: values.confirm_password,
        password_confirmation: values.confirm_password,
      });

      const { user: acceptedUser, message } = extractAcceptPayload(
        res.data,
        values.email,
        invite && invite.valid ? invite.user.role : "employee"
      );

      toast({ title: "Success", description: message });
      setUser(acceptedUser);

      const serializedUser = JSON.stringify(acceptedUser);
      sessionStorage.setItem("user", serializedUser);
      localStorage.removeItem("user");

      if (acceptedUser.token) {
        sessionStorage.setItem("token", acceptedUser.token);
      } else {
        sessionStorage.removeItem("token");
      }
      localStorage.removeItem("token");

      // Route the new user to their default dashboard
      router.push(getRoleLandingPath(acceptedUser.role));
    } catch (e) {
      toast({ title: "Error", description: getErrorMessage(e) });
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
