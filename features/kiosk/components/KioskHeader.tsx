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
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Construction Site Kiosk</h1>
        <p className="text-muted-foreground" suppressHydrationWarning>
          {currentTime ? (
            <>
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              • {currentTime.toLocaleTimeString("en-US", {
                hour12: true,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
              })}
            </>
          ) : (
            "Loading..."
          )}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onReset}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button variant="outline" onClick={() => router.push("/settings")}>
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
        <Button variant="outline" onClick={() => router.push("/")}>
          <Home className="h-4 w-4 mr-2" />
          Admin
        </Button>
      </div>
    </div>
  )
}
