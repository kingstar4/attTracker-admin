"use client"

import {
  useSiteLocationStore,
  DEFAULT_SITE_LOCATION,
  getStoredSiteLocation,
  getSupervisorSiteLocation,
  type SiteLocation,
} from "@/store/useSiteLocationStore"

// Haversine formula to calculate distance between two coordinates in meters
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3 // Earth's radius in meters
  const phi1 = (lat1 * Math.PI) / 180
  const phi2 = (lat2 * Math.PI) / 180
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

export function isWithinGeofence(
  userLat: number,
  userLon: number,
  siteLat: number,
  siteLon: number,
  radiusMeters: number,
): boolean {
  const distance = calculateDistance(userLat, userLon, siteLat, siteLon)
  return distance <= radiusMeters
}

export const getSiteLocation = (): SiteLocation => {
  const supervisorLocation = getSupervisorSiteLocation()
  if (supervisorLocation) {
    return supervisorLocation
  }

  const storedLocation = getStoredSiteLocation()
  if (storedLocation && storedLocation.source === "manual") {
    return storedLocation
  }

  const currentStateLocation = useSiteLocationStore.getState().siteLocation
  if (currentStateLocation.source === "manual") {
    return currentStateLocation
  }

  return DEFAULT_SITE_LOCATION
}

export const getDefaultSiteLocation = (): SiteLocation => DEFAULT_SITE_LOCATION
