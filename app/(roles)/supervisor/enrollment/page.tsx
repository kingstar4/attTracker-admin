"use client";

import Loading from "@/features/loading-state/Loading";
import { FingerprintEnrollment } from "@/features/Supervisor/enrollment/FingerprintEnrollment";
import { Suspense } from "react";

export default function FingerprintEnrollmentPage() {
  return (
    <Suspense fallback={<Loading mode="page" />}>
      <FingerprintEnrollment />
    </Suspense>
  );
}
