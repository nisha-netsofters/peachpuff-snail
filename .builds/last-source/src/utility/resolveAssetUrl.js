import { SERVER_URL } from "../configs/config";

const getAssetBaseUrl = () =>
  String(SERVER_URL || "")
    .replace(/\/api\/?$/, "/")
    .replace(/\/?$/, "/");

const safeEncodeSegment = (seg) => {
  if (!seg) return seg;
  try {
    // Decode first so already-encoded names (e.g. %20) are not double-encoded
    return encodeURIComponent(decodeURIComponent(seg));
  } catch (e) {
    return encodeURIComponent(seg);
  }
};

const encodePath = (pathname) =>
  pathname
    .split("/")
    .map((seg, idx) => (idx === 0 && seg === "" ? "" : safeEncodeSegment(seg)))
    .join("/");

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
  if (trimmed.startsWith("blob:") || trimmed.startsWith("data:")) {
    return trimmed;
  }

  // Absolute URLs: rewrite ngrok / frontend-host upload paths to current API host
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      const path = `${parsed.pathname}${parsed.search || ""}`;
      const isUploadPath =
        path.startsWith("/uploads") || path.includes("/uploads/");
      const isNgrok = /ngrok-free\.app|ngrok\.io|ngrok\.app/i.test(
        parsed.hostname
      );
      const isFrontendLocal =
        (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") &&
        String(parsed.port || "") === "3000";
      if (isUploadPath && (isNgrok || isFrontendLocal)) {
        return `${getAssetBaseUrl().replace(/\/$/, "")}${encodePath(
          parsed.pathname
        )}${parsed.search || ""}`;
      }
    } catch (e) {
      /* keep original */
    }
    return trimmed;
  }

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
    return `${getAssetBaseUrl().replace(/\/$/, "")}/uploads/file/${safeEncodeSegment(
      trimmed
    )}`;
  }
  return trimmed;
};

export default resolveAssetUrl;
