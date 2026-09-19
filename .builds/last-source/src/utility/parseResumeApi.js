import apiCall from "./axiosInterceptor";

const DEFAULT_API_CONFIG_ERROR =
  "Resume auto-extraction is unavailable. Please ask your Super Admin to enable and configure OCR & API Configuration (AI API key and model are required).";

export const AI_VALIDATION_MESSAGES = {
  AI_API_KEY_INVALID:
    "Invalid AI API key. Please ask your Super Admin to update the API key in OCR & API Configuration, then try again.",
  AI_MODEL_INVALID:
    "Invalid or retired AI model. For Claude use claude-haiku-4-5-20251001 in Super Admin → OCR & API Configuration.",
  AI_RATE_LIMIT:
    "AI service rate limit reached. Please wait a moment and try again.",
  AI_SERVICE_BUSY:
    "Gemini is temporarily busy (high demand). Please wait a few seconds and upload again.",
  AI_NETWORK_ERROR:
    "Live server could not reach Google Gemini. This is not an OCR config change — Hostinger may be blocking outbound Gemini API calls.",
  API_CONFIG_NOT_SET: DEFAULT_API_CONFIG_ERROR,
  EXTRACT_TIMEOUT:
    "Resume extraction timed out. AI is taking too long or the connection dropped — try again with 1 file, or use a smaller PDF.",
  EXTRACT_NETWORK:
    "Could not finish resume extraction (network/connection dropped). Backend is up — please retry once, or upload fewer files.",
  EXTRACT_GATEWAY:
    "Server gateway timed out while extracting resume. Please retry with one smaller file.",
};

/**
 * User-facing message for resume extract failures.
 * Never blame "backend down" when the real issue is timeout/AI/network cut.
 */
export function getFriendlyExtractError(result, networkErr) {
  const status = result?.httpStatus || networkErr?.response?.status;
  const axiosCode = String(
    networkErr?.code || result?.axiosCode || ""
  ).toUpperCase();
  const rawNet = String(
    networkErr?.message || result?.error || result?.msg || result?.message || ""
  );
  const lowerNet = rawNet.toLowerCase();

  if (
    axiosCode === "ECONNABORTED" ||
    axiosCode === "ETIMEDOUT" ||
    lowerNet.includes("timeout")
  ) {
    return AI_VALIDATION_MESSAGES.EXTRACT_TIMEOUT;
  }
  if (status === 502 || status === 504 || status === 408) {
    return AI_VALIDATION_MESSAGES.EXTRACT_GATEWAY;
  }
  if (
    axiosCode === "ERR_NETWORK" ||
    axiosCode === "ECONNRESET" ||
    lowerNet.includes("network error") ||
    lowerNet.includes("failed to fetch")
  ) {
    return AI_VALIDATION_MESSAGES.EXTRACT_NETWORK;
  }

  if (!result) {
    return AI_VALIDATION_MESSAGES.EXTRACT_NETWORK;
  }

  if (result.code && AI_VALIDATION_MESSAGES[result.code]) {
    return AI_VALIDATION_MESSAGES[result.code];
  }

  const raw = result.error || result.msg || result.message || "";
  const lower = String(raw).toLowerCase();

  // Already a friendly message from a previous pass — keep it
  if (
    raw.includes("timed out") ||
    raw.includes("network/connection dropped") ||
    raw.includes("gateway timed out")
  ) {
    return raw;
  }

  if (
    lower.includes("invalid api key") ||
    lower.includes("api key not valid") ||
    lower.includes("unauthorized") ||
    lower.includes("invalid authentication")
  ) {
    return AI_VALIDATION_MESSAGES.AI_API_KEY_INVALID;
  }
  if (
    lower.includes("cannot reach google gemini") ||
    lower.includes("enotfound") ||
    lower.includes("econnrefused")
  ) {
    return AI_VALIDATION_MESSAGES.AI_NETWORK_ERROR;
  }
  if (
    lower.includes("high demand") ||
    lower.includes("try again later") ||
    lower.includes("temporarily busy")
  ) {
    return AI_VALIDATION_MESSAGES.AI_SERVICE_BUSY;
  }
  if (
    lower.includes("model") &&
    (lower.includes("invalid") || lower.includes("not found"))
  ) {
    return AI_VALIDATION_MESSAGES.AI_MODEL_INVALID;
  }
  if (lower.includes("status code 404") || lower.includes("not_found_error")) {
    return AI_VALIDATION_MESSAGES.AI_MODEL_INVALID;
  }
  if (/oauth|sign-in|developers\.google|access token/i.test(raw)) {
    return AI_VALIDATION_MESSAGES.AI_API_KEY_INVALID;
  }
  // Old misleading copy still stored in thrown Error.message
  if (
    lower.includes("verify your backend server") ||
    lower.includes("backend server is running")
  ) {
    return AI_VALIDATION_MESSAGES.EXTRACT_NETWORK;
  }
  return raw || "Unable to parse resume. Please try again.";
}

/**
 * Extract resume fields via API.
 * Prefers publicParseResume so a stale/invalid admin token does not abort upload
 * (auth interceptor would otherwise clear session + redirect mid-request).
 */
export async function postParseResume(formData) {
  let result = null;
  let lastNetworkErr = null;

  try {
    result = await apiCall.post("/candidate/publicParseResume", formData);
  } catch (err) {
    lastNetworkErr = err;
    result = err?.response?.data || null;
  }

  if (result?.success) return result;
  if (result?.code) return result;

  let authResult = null;
  try {
    authResult = await apiCall.post("/candidate/parse-resume", formData);
  } catch (err) {
    lastNetworkErr = err;
    authResult = err?.response?.data || null;
  }

  if (authResult?.success || authResult?.code) return authResult;

  const final = authResult || result;
  if (final) return final;

  return {
    success: false,
    code:
      lastNetworkErr?.code === "ECONNABORTED" ||
      String(lastNetworkErr?.message || "")
        .toLowerCase()
        .includes("timeout")
        ? "EXTRACT_TIMEOUT"
        : "EXTRACT_NETWORK",
    error: getFriendlyExtractError(null, lastNetworkErr),
    axiosCode: lastNetworkErr?.code,
    httpStatus: lastNetworkErr?.response?.status,
  };
}
