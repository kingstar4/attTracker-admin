"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { Paper } from "@mui/material";
import { useAuth } from "@/components/AuthWrapper";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setError(null);
    setLoading(true);
    try {
      const success = await login(data.email, data.password);
      if (!success) {
        setError("Login failed. Check credentials.");
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen  flex flex-col items-center justify-center bg-white">
      <Paper elevation={10}
      sx={
        { bgcolor: 'background.paper', width:500, height:400, padding:5, alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', borderRadius:2}
      }>
        <div className="items-center justify-center flex flex-col">
          <h1 className="text-2xl font-bold mb-2 text-center text-gray-800">
            Sign in to AttTracker
          </h1>
          <p className="text-sm text-gray-500 text-center mb-6">
            Enter your credentials to continue
          </p>

          {/* <div className="text-xs text-gray-600 mb-3 text-center">
            Demo credentials: <span className="font-medium">admin@example.com</span> / <span className="font-medium">password123</span>
            <div>
              <button
                type="button"
                onClick={() => {
                  setValue('email', 'admin@example.com')
                  setValue('password', 'password123')
                }}
                className="mt-2 inline-flex items-center px-2 py-1 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50"
              >
                Fill demo
              </button>
            </div>
          </div> */}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <TextField
            label="Email"
            type="email"
            fullWidth
            size="small"
            error={!!errors.email}
            helperText={errors.email ? String(errors.email.message) : ""}
            {...register("email")}
            sx={{ mb: 3}}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            size="small"
            error={!!errors.password}
            helperText={errors.password ? String(errors.password.message) : ""}
            {...register("password")}
            sx={{ mb: 3}}
          />

          <div className="flex justify-end text-sm ">
            <a href="/forgot-password" className="text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 px-3 py-2 rounded-md text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            className="!mt-2"
            sx={{my:2}}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </Paper>
      </div>
  );
}
