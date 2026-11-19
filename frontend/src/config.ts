const envUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/+$/, "");

function getBaseUrl(): string {
  if (envUrl) {
    return envUrl;
  }
  if (
    typeof window !== "undefined" &&
    window.location &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
  ) {
    return "http://127.0.0.1:8000";
  }
  return "https://sru-inventory-backend-production.up.railway.app";
}

export const API_BASE_URL = getBaseUrl();
