import axios from "axios";
import type { AxiosRequestConfig } from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const axiosInstance = (options: AxiosRequestConfig = {}) =>
  axios.create({
    baseURL,
    timeout: 5000,
    withCredentials: options.withCredentials ?? true,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
