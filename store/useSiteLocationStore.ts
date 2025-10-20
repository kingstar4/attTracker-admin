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
  radiusMeters: 200,
  name: "Construction Site Alpha",
  source: "default",
}

const loadInitialLocation = (): SiteLocation => {
  if (typeof window === "undefined") {
    return DEFAULT_SITE_LOCATION
  }

  const storedValue = window.localStorage.getItem(STORAGE_KEY)
  if (!storedValue) {
    return DEFAULT_SITE_LOCATION
  }

  try {
    const parsed = JSON.parse(storedValue) as Partial<SiteLocation>
    if (
      typeof parsed.lat === "number" &&
      typeof parsed.lng === "number" &&
      typeof parsed.radiusMeters === "number" &&
      typeof parsed.name === "string"
    ) {
      return {
        lat: parsed.lat,
        lng: parsed.lng,
        radiusMeters: parsed.radiusMeters,
        name: parsed.name,
        source: parsed.source === "supervisor" || parsed.source === "manual" ? parsed.source : "default",
        updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : undefined,
      }
    }
  } catch (error) {
    console.warn("Failed to parse stored site location", error)
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

export const SITE_LOCATION_STORAGE_KEY = STORAGE_KEY
