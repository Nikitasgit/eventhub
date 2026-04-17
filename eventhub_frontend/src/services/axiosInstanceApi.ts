import axios from "axios";
import type { AxiosRequestConfig } from "axios";
import { getViteApiBaseUrl } from "./viteEnv";

const nodeEnvUrl =
  typeof globalThis !== "undefined" && "process" in globalThis
    ? (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } })
        .process?.env?.VITE_API_URL
    : undefined;

const baseURL =
  getViteApiBaseUrl() || nodeEnvUrl || "http://localhost:8000/api/v1";

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
