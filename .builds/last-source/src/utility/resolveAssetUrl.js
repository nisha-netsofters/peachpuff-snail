import { SERVER_URL } from "../configs/config";

const getAssetBaseUrl = () =>
  String(SERVER_URL || "")
    .replace(/\/api\/?$/, "/")
    .replace(/\/?$/, "/");

/**
 * Resolve profile / upload image paths for <img> / Avatar.
 * Local `/uploads/...` paths are served by the API host, not the React app.
 */
export const resolveAssetUrl = (src) => {
  if (!src || typeof src !== "string") return null;
  const trimmed = src.trim();
  if (
    !trimmed ||
    trimmed === "{}" ||
    trimmed === "undefined" ||
    trimmed === "null"
  ) {
    return null;
  }
  if (
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }

  // Rewrite stale ngrok / wrong-host absolute URLs to current API host
  if (/^https?:\/\//i.test(trimmed)) {
    if (/ngrok-free\.app|ngrok\.io|ngrok\.app/i.test(trimmed)) {
      try {
        const parsed = new URL(trimmed);
        const path = `${parsed.pathname}${parsed.search || ""}`;
        if (path.startsWith("/uploads") || path.includes("/uploads/")) {
          return `${getAssetBaseUrl().replace(/\/$/, "")}${path}`;
        }
      } catch (e) {
        /* keep original */
      }
    }
    return trimmed;
  }

  const encodePath = (pathname) =>
    pathname
      .split("/")
      .map((seg, idx) => (idx === 0 && seg === "" ? "" : encodeURIComponent(seg)))
      .join("/");

  if (trimmed.startsWith("/uploads")) {
    return `${getAssetBaseUrl().replace(/\/$/, "")}${encodePath(trimmed)}`;
  }
  if (trimmed.startsWith("uploads/")) {
    return `${getAssetBaseUrl().replace(/\/$/, "")}/${encodePath(trimmed)}`;
  }
  // Bare filename from local upload (e.g. 1784..._resume.pdf)
  if (
    !trimmed.includes("://") &&
    !trimmed.startsWith("/") &&
    /\.[a-z0-9]{2,5}$/i.test(trimmed)
  ) {
    return `${getAssetBaseUrl().replace(/\/$/, "")}/uploads/file/${encodeURIComponent(
      trimmed
    )}`;
  }
  return trimmed;
};

export default resolveAssetUrl;
