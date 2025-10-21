"use client"

import { create } from "zustand"

export type SiteLocationSource = "default" | "supervisor" | "manual"

export interface SiteLocation {
  lat: number
  lng: number
  radiusMeters: number
  name: string
  source: SiteLocationSource
  updatedAt?: string
}

const STORAGE_KEY = "attTracker.siteLocation"

export const DEFAULT_SITE_LOCATION: SiteLocation = {
  lat: 6.565468, 
  lng: 3.259118,
  radiusMeters: 500,
  name: "Construction Site Alpha",
  source: "default",
}

const parseStoredSiteLocation = (storedValue: string | null): SiteLocation | null => {
  if (!storedValue) {
    return null
  }

  try {
    const parsed = JSON.parse(storedValue) as Partial<SiteLocation>

    if (
      typeof parsed.lat === "number" &&
      Number.isFinite(parsed.lat) &&
      typeof parsed.lng === "number" &&
      Number.isFinite(parsed.lng) &&
      typeof parsed.radiusMeters === "number" &&
      Number.isFinite(parsed.radiusMeters) &&
      typeof parsed.name === "string"
    ) {
      const radiusMeters =
        parsed.radiusMeters > 0 ? parsed.radiusMeters : DEFAULT_SITE_LOCATION.radiusMeters
      const name = parsed.name.trim().length > 0 ? parsed.name : DEFAULT_SITE_LOCATION.name
      const source: SiteLocationSource =
        parsed.source === "supervisor" || parsed.source === "manual" ? parsed.source : "default"

      return {
        lat: parsed.lat,
        lng: parsed.lng,
        radiusMeters,
        name,
        source,
        updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : undefined,
      }
    }
  } catch (error) {
    console.warn("Failed to parse stored site location", error)
  }

  return null
}

const readStoredSiteLocation = (): SiteLocation | null => {
  if (typeof window === "undefined") {
    return null
  }

  const storedValue = window.localStorage.getItem(STORAGE_KEY)
  return parseStoredSiteLocation(storedValue)
}

const loadInitialLocation = (): SiteLocation => {
  const storedLocation = readStoredSiteLocation()
  if (storedLocation) {
    return storedLocation
  }

  return DEFAULT_SITE_LOCATION
}

interface SiteLocationState {
  siteLocation: SiteLocation
  setSiteLocation: (
    location: Omit<SiteLocation, "source" | "updatedAt"> &
      Partial<Pick<SiteLocation, "source" | "updatedAt">>,
  ) => void
  resetSiteLocation: () => void
}

export const useSiteLocationStore = create<SiteLocationState>((set) => ({
  siteLocation: loadInitialLocation(),
  setSiteLocation: (location) => {
    const nextLocation: SiteLocation = {
      lat: location.lat,
      lng: location.lng,
      radiusMeters:
        Number.isFinite(location.radiusMeters) && location.radiusMeters > 0
          ? location.radiusMeters
          : DEFAULT_SITE_LOCATION.radiusMeters,
      name: location.name || DEFAULT_SITE_LOCATION.name,
      source: location.source ?? "manual",
      updatedAt: location.updatedAt ?? new Date().toISOString(),
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextLocation))
    }

    set({ siteLocation: nextLocation })
  },
  resetSiteLocation: () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY)
    }
    set({ siteLocation: DEFAULT_SITE_LOCATION })
  },
}))

const readStoredSupervisorSiteLocation = (): SiteLocation | null => {
  const storedLocation = readStoredSiteLocation()
  return storedLocation && storedLocation.source === "supervisor" ? storedLocation : null
}

export const getStoredSiteLocation = (): SiteLocation | null => readStoredSiteLocation()

export const getSupervisorSiteLocation = (): SiteLocation | null => {
  const { siteLocation } = useSiteLocationStore.getState()

  if (siteLocation.source === "supervisor") {
    return siteLocation
  }

  return readStoredSupervisorSiteLocation()
}

export const SITE_LOCATION_STORAGE_KEY = STORAGE_KEY
