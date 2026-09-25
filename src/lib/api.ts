const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

export function apiUrl(path: string) {
  const normalizedPath = path.startsWith("/")
    ? path
    : `/${path}`;

  return `${API_URL}${normalizedPath}`;
}