// @ts-nocheck — réservé au bundler Vite ; Jest ne charge pas ce module (voir axiosInstanceApi).
/// <reference types="vite/client" />

export function getViteApiBaseUrl(): string | undefined {
  return import.meta.env?.VITE_API_URL;
}
