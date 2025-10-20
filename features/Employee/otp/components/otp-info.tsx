"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, Shield, MapPin, Clock } from "lucide-react"
import { useSiteLocationStore } from "@/store/useSiteLocationStore"

const formatCoordinate = (value: number, axis: "lat" | "lng") => {
  const direction = axis === "lat" ? (value >= 0 ? "N" : "S") : value >= 0 ? "E" : "W"
  return `${Math.abs(value).toFixed(4)} deg ${direction}`
}

export function OTPInfo() {
  const siteLocation = useSiteLocationStore((state) => state.siteLocation)
  const formattedLat = formatCoordinate(siteLocation.lat, "lat")
  const formattedLng = formatCoordinate(siteLocation.lng, "lng")

  return (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> Use OTP only if the biometric kiosk is unavailable. OTP generation is enabled
          strictly within the construction site geofence for security purposes.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Features
          </CardTitle>
          <CardDescription>Multiple security layers protect the OTP system</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">Geofencing</h4>
                <p className="text-sm text-muted-foreground">
                  OTP can only be generated when you are physically present at the construction site
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">Time Limits</h4>
                <p className="text-sm text-muted-foreground">
                  Each OTP expires after 60 seconds and has a 60-second cooldown period
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Site Information</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                <strong>Site:</strong> {siteLocation.name}
              </p>
              <p>
                <strong>Geofence Radius:</strong> {siteLocation.radiusMeters} meters
              </p>
              <p>
                <strong>Location:</strong> {formattedLat}, {formattedLng}
              </p>
              {siteLocation.updatedAt && (
                <p>
                  <strong>Last Updated:</strong> {new Date(siteLocation.updatedAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
