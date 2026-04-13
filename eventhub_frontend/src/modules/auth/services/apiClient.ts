import { axiosInstance } from "../../../services";
import axios, { type AxiosError } from "axios";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    message: string;
    code: number;
  };
}

interface User {
  id: string;
  email: string;
  role: string;
  twoFactorEnabled?: boolean;
}

async function fetchApi<T>(
  endpoint: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
  } = {},
): Promise<T> {
  try {
    const client = axiosInstance();
    const response = await client.request<ApiResponse<T>>({
      url: endpoint,
      method: options.method || "GET",
      data: options.body,
    });

    const data = response.data;

    if (!data.success) {
      const errorMessage =
        data.error?.message ||
        `Erreur ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>;
      const errorMessage =
        axiosError.response?.data?.error?.message ||
        axiosError.message ||
        `Erreur ${axiosError.response?.status || 500}`;
      throw new Error(errorMessage);
    }
    throw error;
  }
}

export const apiClient = {
  async register(email: string, password: string): Promise<{ user: User }> {
    return fetchApi<{ user: User }>("/auth/register", {
      method: "POST",
      body: { email, password },
    });
  },

  async login(
    email: string,
    password: string,
  ): Promise<{ user: User } | { requiresTwoFactor: true }> {
    return fetchApi<{ user: User } | { requiresTwoFactor: true }>(
      "/auth/login",
      {
        method: "POST",
        body: { email, password },
      },
    );
  },

  async verifyTwoFactorAuth(code: string): Promise<{ user: User }> {
    return fetchApi<{ user: User }>("/auth/verify-2fa", {
      method: "POST",
      body: { code },
    });
  },

  async verifyBackupCode(code: string): Promise<{ user: User }> {
    return fetchApi<{ user: User }>("/auth/verify-backup-code", {
      method: "POST",
      body: { code },
    });
  },

  async logout(): Promise<void> {
    await fetchApi("/auth/logout", {
      method: "POST",
    });
  },

  async getCurrentUser(): Promise<{ user: User }> {
    return fetchApi<{ user: User }>("/auth/me", {
      method: "GET",
    });
  },

  async getQrCode(): Promise<{
    qrCode: { image: string; email: string; secret: string };
  }> {
    return fetchApi<{
      qrCode: { image: string; email: string; secret: string };
    }>("/a2f/qr-code", {
      method: "GET",
    });
  },

  async enableTwoFactorAuth(
    secret: string,
    code: string,
  ): Promise<{ message: string; backupCodes: string[] }> {
    return fetchApi<{ message: string; backupCodes: string[] }>("/a2f/enable", {
      method: "POST",
      body: { secret, code },
    });
  },

  async disableTwoFactorAuth(): Promise<{ message: string }> {
    return fetchApi<{ message: string }>("/a2f/disable", {
      method: "POST",
    });
  },
};
