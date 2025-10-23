"use client";

import type React from "react";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
// import { ThreeJSHeader } from "./ThreeJSHeader"
import { useMediaQuery } from "@/hooks/use-mobile";
import { useAuthStore, type AuthUser } from "@/store/useAuthStore";
import { useSiteLocationStore } from "@/store/useSiteLocationStore";
import Loading from "@/features/loading-state/Loading";
import Validating from "@/features/loading-state/Validating";

interface LayoutProps {
  children: React.ReactNode;
}

const getStoredUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;
  const storedUser =
    sessionStorage.getItem("user") ?? localStorage.getItem("user");
  if (!storedUser) return null;
  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch (error) {
    console.warn("Failed to parse stored user", error);
    sessionStorage.removeItem("user");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
    return null;
  }
};

export function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const siteLocation = useSiteLocationStore((state) => state.siteLocation);
  const setSiteLocation = useSiteLocationStore(
    (state) => state.setSiteLocation
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showFreshLoginLoading, setShowFreshLoginLoading] = useState(false);
  const [showPageLoading, setShowPageLoading] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const locationRequestedForUserRef = useRef<string | null>(null);
  const locationWatchIdRef = useRef<number | null>(null);
  const routeLoadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const welcomeLoadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const hasShownWelcomeRef = useRef(false);
  const lastRouteKeyRef = useRef<string | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsKey = useMemo(
    () => (searchParams ? searchParams.toString() : ""),
    [searchParams]
  );

  const hasUser = Boolean(user);

  useEffect(() => {
    if (hasUser) {
      setCheckingAuth(false);
      return;
    }

    const storedUser = getStoredUser();
    const storedToken =
      typeof window !== "undefined"
        ? (sessionStorage.getItem("token") ?? localStorage.getItem("token"))
        : null;

    if (storedUser && storedToken) {
      setUser(storedUser);
      hasShownWelcomeRef.current = true;
      setShowFreshLoginLoading(false);
      setCheckingAuth(false);
      return;
    }

    setCheckingAuth(false);
    router.replace("/login");
  }, [hasUser, setUser, router]);

  useEffect(() => {
    return () => {
      if (routeLoadingTimeoutRef.current) {
        clearTimeout(routeLoadingTimeoutRef.current);
      }
      if (welcomeLoadingTimeoutRef.current) {
        clearTimeout(welcomeLoadingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!hasUser || user?.role !== "supervisor") {
      return;
    }

    const userIdentifier = user?.id ?? user?.email ?? "supervisor";
    const alreadyRequested =
      locationRequestedForUserRef.current === userIdentifier;
    const locationOutdated = siteLocation.source !== "supervisor";

    if (alreadyRequested && !locationOutdated) {
      return;
    }

    locationRequestedForUserRef.current = userIdentifier;

    if (!("geolocation" in navigator)) {
      console.warn("Geolocation is not supported in this environment.");
      return;
    }

    const fallbackName =
      user?.companyName ||
      [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
      "Supervisor Site";

    const handleSuccess = (position: GeolocationPosition) => {
      setSiteLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        radiusMeters: siteLocation.radiusMeters,
        name: fallbackName,
        source: "supervisor",
        updatedAt: new Date().toISOString(),
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      console.warn("Unable to capture supervisor location", error);
    };

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    };

    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      options
    );
    const watchId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      options
    );
    locationWatchIdRef.current = watchId;

    return () => {
      if (locationWatchIdRef.current !== null) {
        navigator.geolocation.clearWatch(locationWatchIdRef.current);
        locationWatchIdRef.current = null;
      }
    };
  }, [
    hasUser,
    user,
    siteLocation.radiusMeters,
    siteLocation.source,
    setSiteLocation,
  ]);

  useEffect(() => {
    if (checkingAuth) {
      return;
    }

    if (hasUser) {
      if (!hasShownWelcomeRef.current) {
        hasShownWelcomeRef.current = true;
        setShowFreshLoginLoading(true);
        if (welcomeLoadingTimeoutRef.current) {
          clearTimeout(welcomeLoadingTimeoutRef.current);
        }
        welcomeLoadingTimeoutRef.current = setTimeout(() => {
          setShowFreshLoginLoading(false);
          welcomeLoadingTimeoutRef.current = null;
        }, 1500);
      }
    } else {
      hasShownWelcomeRef.current = false;
      setShowFreshLoginLoading(false);
      if (welcomeLoadingTimeoutRef.current) {
        clearTimeout(welcomeLoadingTimeoutRef.current);
        welcomeLoadingTimeoutRef.current = null;
      }
    }
  }, [hasUser, checkingAuth]);

  useEffect(() => {
    if (!hasUser) {
      lastRouteKeyRef.current = null;
    }
  }, [hasUser]);

  useEffect(() => {
    if (checkingAuth || showFreshLoginLoading) {
      return;
    }

    if (!hasUser) {
      setShowPageLoading(false);
      return;
    }

    const currentRouteKey = `${pathname}?${searchParamsKey}`;

    if (lastRouteKeyRef.current === null) {
      lastRouteKeyRef.current = currentRouteKey;
      return;
    }

    if (lastRouteKeyRef.current === currentRouteKey) {
      return;
    }

    lastRouteKeyRef.current = currentRouteKey;
    setShowPageLoading(true);

    if (routeLoadingTimeoutRef.current) {
      clearTimeout(routeLoadingTimeoutRef.current);
    }

    routeLoadingTimeoutRef.current = setTimeout(() => {
      setShowPageLoading(false);
      routeLoadingTimeoutRef.current = null;
    }, 1000);
  }, [
    pathname,
    searchParamsKey,
    hasUser,
    checkingAuth,
    showFreshLoginLoading,
  ]);

  if (checkingAuth) {
    return <Validating />;
  }

  if (hasUser && showFreshLoginLoading) {
    return <Loading mode="welcome" />;
  }

  if (showPageLoading) {
    return <Loading mode="page" />;
  }

  if (!hasUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />

      <div className="flex">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isMobile={isMobile}
        />

        <main
          className={`flex-1 transition-all duration-300 ${
            !isMobile ? "ml-64" : ""
          }`}
        >
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
