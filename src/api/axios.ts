import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://otonav-backend-production.up.railway.app/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token storage
const ACCESS_TOKEN_KEY = "auth_access_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";

export const tokenStorage = {
  getAccessToken: (): string | null => {
    if (typeof window === "undefined") return null;
    try {
      return (
        sessionStorage.getItem(ACCESS_TOKEN_KEY) ||
        localStorage.getItem(ACCESS_TOKEN_KEY)
      );
    } catch {
      return null;
    }
  },

  setAccessToken: (token: string, persist: boolean = false): void => {
    if (typeof window === "undefined") return;
    try {
      if (persist) {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
      } else {
        sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
      }
    } catch (error) {
      console.error("Error storing access token:", error);
    }
  },

  getRefreshToken: (): string | null => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setRefreshToken: (token: string): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    } catch (error) {
      console.error("Error storing refresh token:", error);
    }
  },

  clearTokens: (): void => {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error("Error clearing tokens:", error);
    }
  },
};

// Token expiration check
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expirationTime = payload.exp * 1000;
    return expirationTime < Date.now() + 60000; // 1 minute buffer
  } catch {
    return true;
  }
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = tokenStorage.getAccessToken();

    if (accessToken && !isTokenExpired(accessToken)) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Store tokens from auth responses
    if (response.data?.data?.accessToken) {
      const isAuthRequest =
        response.config.url?.includes("/login") ||
        response.config.url?.includes("/register") ||
        response.config.url?.includes("/refresh-token") ||
        response.config.url?.includes("/complete-registration");

      tokenStorage.setAccessToken(
        response.data.data.accessToken,
        isAuthRequest
      );

      // Note: Your API might send refresh token in cookies instead
      if (response.data.data.refreshToken) {
        tokenStorage.setRefreshToken(response.data.data.refreshToken);
      }
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors with token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) {
        tokenStorage.clearTokens();
        return Promise.reject(error);
      }

      try {
        // Try to refresh the token
        const refreshResponse = await axiosInstance.post(
          "/auth/refresh-token",
          {
            refreshToken,
          }
        );

        if (refreshResponse.data.data?.accessToken) {
          // Store new tokens
          tokenStorage.setAccessToken(
            refreshResponse.data.data.accessToken,
            true
          );
          if (refreshResponse.data.data.refreshToken) {
            tokenStorage.setRefreshToken(
              refreshResponse.data.data.refreshToken
            );
          }

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.data.accessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens
        tokenStorage.clearTokens();

        // You might want to redirect to login here
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
