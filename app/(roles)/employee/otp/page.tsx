"use client"

import { Suspense } from "react"
import { OtpPage } from "@/features/Employee/otp/OtpPage"

export default function Otp() {
  return (
    <Suspense fallback={<OtpLoading />}>
      <OtpPage />
    </Suspense>
  )
}

function OtpLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">Loading OTP screen…</p>
    </div>
  )
}
