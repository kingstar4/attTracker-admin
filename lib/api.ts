import axios, { AxiosInstance } from "axios";

const BASE_URL= process.env.NEXT_PUBLIC_API_BASE_URL;
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Endpoints that must never include an Authorization header
const skipAuthEndpoints = ["/invite/accept"];

const shouldSkipAuthHeader = (url?: string, baseURL?: string): boolean => {
  if (!url) return false;

  try {
    const resolvedBase =
      baseURL ??
      (typeof window !== "undefined" ? window.location.origin : "http://localhost");
    // Normalise to a pathname for easier comparison
    const absoluteUrl = /^https?:\/\//i.test(url)
      ? new URL(url)
      : new URL(url, resolvedBase);
    const { pathname } = absoluteUrl;

    return skipAuthEndpoints.some((endpoint) =>
      pathname.startsWith(endpoint.replace(/\/+$/, ""))
    );
  } catch {
    // If URL parsing fails, fall back to a simple prefix check
    return skipAuthEndpoints.some((endpoint) => url.startsWith(endpoint));
  }
};

// Request interceptor: attach token
api.interceptors.request.use(
  (config) => {
    // e.g. attach a JWT token if exists
    const token =
      localStorage.getItem("token") ?? sessionStorage.getItem("token");

    const skipAuth = shouldSkipAuthHeader(config.url, config.baseURL ?? undefined);

    if (!skipAuth && token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Log full Axios error for debugging
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", {
        message: error.message,
        code: error.code,
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data,
        status: error.response?.status,
        respData: error.response?.data,
      })
    } else {
      console.error("Non-Axios error:", error)
    }
    return Promise.reject(error)
  }
);

// Response interceptor: handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // token expired; clear stored session and redirect
      console.warn("Unauthorized! Redirecting to login...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
