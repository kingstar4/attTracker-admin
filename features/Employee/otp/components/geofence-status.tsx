"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useGeolocation } from "@/hooks/use-geolocation"
import { isWithinGeofence } from "@/lib/geofence"
import { useSiteLocationStore } from "@/store/useSiteLocationStore"
import { MapPin, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { useMemo } from "react"

export function GeofenceStatus() {
  const { latitude, longitude, error, loading } = useGeolocation()
  const siteLocation = useSiteLocationStore((state) => state.siteLocation)

  const geofenceStatus = useMemo(() => {
    if (loading) return { status: "loading", message: "Getting your location..." }
    if (error) return { status: "error", message: error }
    if (latitude === null || longitude === null) return { status: "error", message: "Location unavailable" }

    const withinGeofence = isWithinGeofence(
      latitude,
      longitude,
      siteLocation.lat,
      siteLocation.lng,
      siteLocation.radiusMeters,
    )

    return {
      status: withinGeofence ? "inside" : "outside",
      message: withinGeofence
        ? `You are within ${siteLocation.radiusMeters}m of ${siteLocation.name}`
        : `You are outside the ${siteLocation.radiusMeters}m radius of ${siteLocation.name}`,
      coordinates: { lat: latitude, lng: longitude },
    }
  }, [latitude, longitude, error, loading, siteLocation])

  const getStatusIcon = () => {
    switch (geofenceStatus.status) {
      case "loading":
        return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      case "inside":
        return <CheckCircle className="h-5 w-5 text-present" />
      case "outside":
        return <XCircle className="h-5 w-5 text-absent" />
      case "error":
        return <XCircle className="h-5 w-5 text-destructive" />
      default:
        return <MapPin className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusBadge = () => {
    switch (geofenceStatus.status) {
      case "loading":
        return <Badge variant="secondary">Checking Location...</Badge>
      case "inside":
        return <Badge className="bg-present text-white">Inside Geofence</Badge>
      case "outside":
        return <Badge className="bg-absent text-white">Outside Geofence</Badge>
      case "error":
        return <Badge variant="destructive">Location Error</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          Location Status
        </CardTitle>
        <CardDescription>
          OTP generation is only available when you are within the construction site geofence
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Current Status:</span>
          {getStatusBadge()}
        </div>

        <div className="text-sm text-muted-foreground">
          <p>{geofenceStatus.message}</p>
        </div>

        {geofenceStatus.coordinates && (
          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              Your Location: {geofenceStatus.coordinates.lat.toFixed(6)}, {geofenceStatus.coordinates.lng.toFixed(6)}
            </p>
            <p>
              Site Location: {siteLocation.lat.toFixed(6)}, {siteLocation.lng.toFixed(6)}
            </p>
            <p>Required Radius: {siteLocation.radiusMeters}m</p>
          </div>
        )}

        <div className="p-3 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Note:</strong> Use OTP only if the biometric kiosk is unavailable. OTP generation is strictly
            controlled by geofencing for security purposes.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
