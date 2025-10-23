"use client"

import dynamic from "next/dynamic"

const OwnerSupervisorsPage = dynamic(
  () => import("@/features/Owner/supervisors/OwnerSupervisorsPage"),
  { ssr: false },
)

export default function OwnerSupervisors() {
  return <OwnerSupervisorsPage />
}
