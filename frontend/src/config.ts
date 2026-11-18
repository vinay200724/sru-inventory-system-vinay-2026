const envUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/+$/, "");

function getBaseUrl(): string {
  if (envUrl) {
    return envUrl;
  }
  if (
    typeof window !== "undefined" &&
    window.location &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
  ) {
    return "https://sru-inventory-system-vinay-2026.onrender.com";
  }
  if (import.meta.env.PROD) {
    return "https://sru-inventory-system-vinay-2026.onrender.com";
  }
  return "http://127.0.0.1:8000";
}

export const API_BASE_URL = getBaseUrl();
