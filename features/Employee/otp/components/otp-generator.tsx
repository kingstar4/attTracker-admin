"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useGeolocation } from "@/hooks/use-geolocation"
import { isWithinGeofence } from "@/lib/geofence"
import { useToast } from "@/hooks/use-toast"
import { KeyRound, MailCheck, MapPin, RefreshCw, WifiOff } from "lucide-react"
import api from "@/lib/api"
import { useAuthStore } from "@/store/useAuthStore"
import { useSiteLocationStore } from "@/store/useSiteLocationStore"
import { cn } from "@/lib/utils"

const LOCKOUT_SECONDS = 60

async function fetchPublicIp(): Promise<string | null> {
  try {
    const response = await fetch("https://api.ipify.org?format=json")
    if (!response.ok) {
      throw new Error("Failed to fetch IP")
    }
    const data = await response.json()
    return data.ip as string
  } catch (error) {
    console.error("Unable to determine device IP", error)
    return null
  }
}

export function OTPGenerator() {
  const userEmail = useAuthStore((state) => state.user?.email ?? null)
  const siteLocation = useSiteLocationStore((state) => state.siteLocation)
  const { latitude, longitude, error: locationError, loading: locationLoading } = useGeolocation()
  const { toast } = useToast()

  const [deviceIp, setDeviceIp] = useState<string>("")
  const [ipError, setIpError] = useState<string | null>(null)
  const [isFetchingIp, setIsFetchingIp] = useState(false)
  const [isRequesting, setIsRequesting] = useState(false)
  const [lockoutEnd, setLockoutEnd] = useState<number | null>(null)
  const [lastRequestedAt, setLastRequestedAt] = useState<number | null>(null)

  const isWithinSite = useMemo(() => {
    if (locationLoading || locationError || latitude === null || longitude === null) return false
    return isWithinGeofence(latitude, longitude, siteLocation.lat, siteLocation.lng, siteLocation.radiusMeters)
  }, [latitude, longitude, locationLoading, locationError, siteLocation])

  useEffect(() => {
    let timer: number | undefined
    if (lockoutEnd) {
      timer = window.setInterval(() => {
        if (lockoutEnd <= Date.now()) {
          setLockoutEnd(null)
          window.clearInterval(timer)
        }
      }, 1000)
    }
    return () => {
      if (timer) window.clearInterval(timer)
    }
  }, [lockoutEnd])

  useEffect(() => {
    const initialiseIp = async () => {
      setIsFetchingIp(true)
      const ip = await fetchPublicIp()
      if (ip) {
        setDeviceIp(ip)
        setIpError(null)
      } else {
        setIpError("Unable to detect device IP automatically. Please enter it manually.")
      }
      setIsFetchingIp(false)
    }

    void initialiseIp()
  }, [])

  const lockoutSecondsRemaining = useMemo(() => {
    if (!lockoutEnd) return 0
    return Math.max(0, Math.ceil((lockoutEnd - Date.now()) / 1000))
  }, [lockoutEnd])

  const canRequestOtp =
    !!userEmail &&
    isWithinSite &&
    !locationLoading &&
    !locationError &&
    !!deviceIp &&
    !isRequesting &&
    lockoutSecondsRemaining === 0

  const handleRequestOtp = async () => {
    if (!userEmail) {
      toast({
        title: "Missing Email",
        description: "We could not find your account email. Please re-login and try again.",
        variant: "destructive",
      })
      return
    }

    if (!deviceIp) {
      toast({
        title: "Device IP required",
        description: "Enter the device IP to request an OTP.",
        variant: "destructive",
      })
      return
    }

    setIsRequesting(true)
    try {
      await api.post("/auth/request-otp", {
        email: userEmail,
        device_ip: deviceIp,
      })

      setLockoutEnd(Date.now() + LOCKOUT_SECONDS * 1000)
      setLastRequestedAt(Date.now())

      toast({
        title: "OTP Sent",
        description: `A one-time password has been emailed to ${userEmail}.`,
      })
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        error?.message ??
        "Failed to request OTP. Please try again."

      toast({
        title: "Request Failed",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsRequesting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="h-5 w-5" />
          OTP Generator
        </CardTitle>
        <CardDescription>
          Request a one-time password. The code will be delivered to your registered email address.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Account Email</span>
            {userEmail ? (
              <Badge variant="secondary" className="font-mono">
                {userEmail}
              </Badge>
            ) : (
              <Badge variant="destructive">Not Available</Badge>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Device IP Address</span>
              {isFetchingIp ? (
                <Badge variant="secondary" className="gap-1">
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  Detecting
                </Badge>
              ) : deviceIp ? (
                <Badge variant="outline">{deviceIp}</Badge>
              ) : (
                <Badge variant="destructive" className="gap-1">
                  <WifiOff className="h-3 w-3" />
                  Required
                </Badge>
              )}
            </div>
            <Input
              placeholder="Enter or confirm your device IP"
              value={deviceIp}
              onChange={(event) => setDeviceIp(event.target.value)}
              disabled={isRequesting}
            />
            {ipError && <p className="text-xs text-destructive">{ipError}</p>}
            <div className="flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={async () => {
                  setIsFetchingIp(true)
                  const ip = await fetchPublicIp()
                  if (ip) {
                    setDeviceIp(ip)
                    setIpError(null)
                  } else {
                    setIpError("Automatic detection failed. Please enter the IP manually.")
                  }
                  setIsFetchingIp(false)
                }}
                disabled={isFetchingIp || isRequesting}
              >
                <RefreshCw className={cn("h-3 w-3 mr-2", isFetchingIp && "animate-spin")} />
                Refresh IP
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Button
            onClick={handleRequestOtp}
            disabled={!canRequestOtp}
            className="w-full gap-2"
            size="lg"
          >
            {isRequesting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <MailCheck className="h-4 w-4" />}
            Generate OTP
          </Button>

          {!isWithinSite && !locationLoading && !locationError && (
            <p className="text-xs text-destructive text-center">
              You must be within the supervisor&apos;s geofence to request an OTP.
            </p>
          )}

          {locationLoading && (
            <p className="text-xs text-muted-foreground text-center">Confirming your location...</p>
          )}

          {locationError && (
            <p className="text-xs text-destructive text-center">
              Location error: {locationError}. OTP requests are disabled until location is available.
            </p>
          )}

          {lockoutSecondsRemaining > 0 && (
            <p className="text-xs text-muted-foreground text-center">
              You can request a new OTP in {lockoutSecondsRemaining}s.
            </p>
          )}

          {lastRequestedAt && (
            <p className="text-xs text-muted-foreground text-center">
              Last request: {new Date(lastRequestedAt).toLocaleTimeString()}
            </p>
          )}
        </div>

        <div className="p-3 bg-muted rounded-lg space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <MapPin className="h-4 w-4" />
            Location Reminder
          </div>
          <p>
            OTP requests are only allowed when you are physically present at <strong>{siteLocation.name}</strong>.
            Ensure you share the received OTP code with your supervisor to complete attendance.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
