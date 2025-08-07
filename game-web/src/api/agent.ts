import axios from "axios";
import axiosRetry from "axios-retry";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5215/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

axiosRetry(api, { retries: 3 });

api.interceptors.request.use(
  (config) => config,
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(
        `[API Error] ${error.response.status} ${error.config.url}`,
        error.response.data
      );
    } else {
      console.error("[API Error]", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
