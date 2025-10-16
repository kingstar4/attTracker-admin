import axios, {AxiosInstance} from 'axios';
const api: AxiosInstance = axios.create({
    baseURL: 'https://employee-tracker.duckdns.org/api',
    headers:{
        "Content-Type": "application/json"
    }
})

// Request interceptor: attach token
api.interceptors.request.use(
  (config) => {
    // e.g. attach a JWT token if exists
    const token =
      localStorage.getItem("token") ?? sessionStorage.getItem("token");
    if (token && config.headers) {
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
