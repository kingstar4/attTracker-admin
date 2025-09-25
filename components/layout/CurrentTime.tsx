"use client"

import { useState, useEffect } from "react"

export function CurrentTime() {
  const [time, setTime] = useState<Date | null>(null)

  useEffect(() => {
    // Set initial time
    setTime(new Date())
    
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Return empty div during SSR
  if (!time) {
    return <div className="text-sm text-muted-foreground font-mono">--:--:--</div>
  }

  return (
    <div className="text-sm text-muted-foreground font-mono" suppressHydrationWarning>
      {time.toLocaleTimeString('en-US', {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })}
    </div>
  )
}
