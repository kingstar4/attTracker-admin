"use client"

import { Button } from "@/components/ui/button"
import { Home, RefreshCw, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

interface KioskHeaderProps {
  onReset: () => void
}

export function KioskHeader({ onReset }: KioskHeaderProps) {
  const router = useRouter()

  const [currentTime, setCurrentTime] = useState<Date | null>(null)

  useEffect(() => {
    // Set initial time
    setCurrentTime(new Date())

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-center sm:text-left">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Construction Site Kiosk</h1>
        <p className="text-sm text-muted-foreground sm:text-base" suppressHydrationWarning>
          {currentTime ? (
            <>
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              -{" "}
              {currentTime.toLocaleTimeString("en-US", {
                hour12: true,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </>
          ) : (
            "Loading..."
          )}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 sm:justify-end">
        <Button variant="outline" onClick={onReset} className="w-full sm:w-auto">
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset
        </Button>
        <Button variant="outline" onClick={() => router.push("/settings")} className="w-full sm:w-auto">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
        <Button variant="outline" onClick={() => router.push("/")} className="w-full sm:w-auto">
          <Home className="mr-2 h-4 w-4" />
          Admin
        </Button>
      </div>
    </div>
  )
}
