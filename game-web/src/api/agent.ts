import axios, { AxiosError } from "axios";
import axiosRetry from "axios-retry";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5215/api",
  headers: { "Content-Type": "application/json" },
  timeout: 5000,
});

api.interceptors.request.use((config) => config);

api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (axios.isCancel(error)) return Promise.reject(error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;
      let msg = "Request failed.";

      if (!error.response) {
        msg = "Network error - check your connection and try again.";
      } else if (status! >= 500) {
        msg = "Server error - please try again in a moment.";
      } else if (status === 400) {
        if (Array.isArray(data)) {
          msg = data.join("\n");
        } else if (data?.errors && typeof data.errors === "object") {
          msg =
            Object.values<string[]>(data.errors).flat().join("\n") ||
            "Invalid request.";
        } else {
          msg = typeof data === "string" ? data : "Invalid request.";
        }
      } else if (status === 401) msg = "Not authorized.";
      else if (status === 403) msg = "Forbidden.";
      else if (status === 404) msg = "Not found.";
      else if (status === 429) msg = "Too many requests - try again soon.";
      else msg = typeof data === "string" ? data : msg;

      toast.error(msg);
      return Promise.reject(error);
    }

    toast.error("Unexpected error.");
    return Promise.reject(error);
  }
);

axiosRetry(api, {
  retries: 2,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (e: AxiosError) =>
    !e.response || e.response.status >= 500 || e.response.status === 429,
});

export default api;
