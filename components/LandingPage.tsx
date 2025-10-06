"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LandingPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <Button onClick={() => router.push("/signup")}>Sign Up (As Owner)</Button>
      <Button onClick={() => router.push("/login")}>Sign in</Button>
    </div>
  );
}
