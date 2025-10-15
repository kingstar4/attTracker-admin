"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, Shield, MapPin, Clock } from "lucide-react"

export function OTPInfo() {
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
                <strong>Site:</strong> Construction Site Alpha
              </p>
              <p>
                <strong>Geofence Radius:</strong> 100 meters
              </p>
              <p>
                <strong>Location:</strong> 40.7128°N, 74.0060°W
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
