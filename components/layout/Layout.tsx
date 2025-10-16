"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
// import { ThreeJSHeader } from "./ThreeJSHeader"
import { useMediaQuery } from "@/hooks/use-mobile";
import { useAuthStore, type AuthUser } from "@/store/useAuthStore";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const hasUser = Boolean(user);

  useEffect(() => {
    if (hasUser) {
      setCheckingAuth(false);
      return;
    }

    const storedUser = getStoredUser();
    const storedToken =
      typeof window !== "undefined"
        ? sessionStorage.getItem("token") ?? localStorage.getItem("token")
        : null;

    if (storedUser && storedToken) {
      setUser(storedUser);
      setCheckingAuth(false);
      return;
    }

    setCheckingAuth(false);
    router.replace("/login");
  }, [hasUser, setUser, router]);

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Validating session...
      </div>
    );
  }

  if (!hasUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* <ThreeJSHeader /> */}
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
