"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useGeolocation } from "@/hooks/use-geolocation"
import { isWithinGeofence, SITE_LOCATION } from "@/lib/geofence"
import { useToast } from "@/hooks/use-toast"
import { KeyRound, Copy, Clock, LogIn, LogOut, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface OTPData {
  code: string
  expiresAt: number
  direction: "in" | "out"
}

export function OTPGenerator() {
  const [otp, setOtp] = useState<OTPData | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [lockoutTime, setLockoutTime] = useState<number>(0)

  const { latitude, longitude, error, loading } = useGeolocation()
  const { toast } = useToast()

  const isWithinSite =
    latitude !== null &&
    longitude !== null &&
    isWithinGeofence(latitude, longitude, SITE_LOCATION.lat, SITE_LOCATION.lng, SITE_LOCATION.radiusMeters)

  const canGenerateOTP = !loading && !error && isWithinSite && lockoutTime === 0

  // Update countdown timers
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()

      // Update OTP expiry countdown
      if (otp && otp.expiresAt > now) {
        setTimeLeft(Math.ceil((otp.expiresAt - now) / 1000))
      } else if (otp) {
        setOtp(null)
        setTimeLeft(0)
      }

      // Update lockout countdown
      if (lockoutTime > now) {
        // Lockout still active
      } else if (lockoutTime > 0) {
        setLockoutTime(0)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [otp, lockoutTime])

  const generateOTP = async (direction: "in" | "out") => {
    if (!canGenerateOTP) return

    setIsGenerating(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate 6-digit OTP
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      const expiresAt = Date.now() + 60000 // 60 seconds from now

      setOtp({
        code,
        expiresAt,
        direction,
      })

      // Set lockout for 60 seconds
      setLockoutTime(Date.now() + 60000)

      toast({
        title: "OTP Generated",
        description: `Your ${direction === "in" ? "clock-in" : "clock-out"} OTP is ready. Valid for 60 seconds.`,
      })
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate OTP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    if (!otp) return

    try {
      await navigator.clipboard.writeText(otp.code)
      toast({
        title: "Copied!",
        description: "OTP code copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy OTP to clipboard",
        variant: "destructive",
      })
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getLockoutTimeLeft = () => {
    if (lockoutTime === 0) return 0
    return Math.max(0, Math.ceil((lockoutTime - Date.now()) / 1000))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="h-5 w-5" />
          OTP Generator
        </CardTitle>
        <CardDescription>Generate one-time password for attendance when biometric kiosk is unavailable</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current OTP Display */}
        {otp && (
          <div className="p-4 bg-card border rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Active OTP</h4>
              <Badge
                className={cn("capitalize", otp.direction === "in" ? "bg-present text-white" : "bg-navbar text-white")}
              >
                Clock {otp.direction}
              </Badge>
            </div>

            <div className="text-center space-y-2">
              <div className="text-3xl font-mono font-bold tracking-wider">{otp.code}</div>
              <Button variant="outline" size="sm" onClick={copyToClipboard} className="gap-2 bg-transparent">
                <Copy className="h-4 w-4" />
                Copy Code
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Expires in: {formatTime(timeLeft)}</span>
            </div>
          </div>
        )}

        {/* Generation Buttons */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => generateOTP("in")}
              disabled={!canGenerateOTP || isGenerating || !!otp}
              className="gap-2"
              variant="default"
            >
              {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
              Clock In OTP
            </Button>

            <Button
              onClick={() => generateOTP("out")}
              disabled={!canGenerateOTP || isGenerating || !!otp}
              className="gap-2"
              variant="secondary"
            >
              {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
              Clock Out OTP
            </Button>
          </div>

          {/* Status Messages */}
          {loading && <p className="text-sm text-muted-foreground text-center">Checking your location...</p>}

          {error && <p className="text-sm text-destructive text-center">Location error: {error}</p>}

          {!loading && !error && !isWithinSite && (
            <p className="text-sm text-destructive text-center">
              You must be within the construction site to generate OTP
            </p>
          )}

          {getLockoutTimeLeft() > 0 && (
            <p className="text-sm text-muted-foreground text-center">
              Next OTP available in: {formatTime(getLockoutTimeLeft())}
            </p>
          )}

          {otp && (
            <p className="text-sm text-muted-foreground text-center">
              Please use the current OTP before generating a new one
            </p>
          )}
        </div>

        {/* Instructions */}
        <div className="p-3 bg-muted rounded-lg">
          <h5 className="font-medium mb-2">How to use OTP:</h5>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Ensure you are within the construction site geofence</li>
            <li>Generate an OTP for clock-in or clock-out</li>
            <li>Copy the 6-digit code</li>
            <li>Enter the code at the attendance kiosk or supervisor station</li>
            <li>OTP expires after 60 seconds for security</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}
