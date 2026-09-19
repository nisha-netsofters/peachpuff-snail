import apiCall from "./axiosInterceptor";

const DEFAULT_API_CONFIG_ERROR =
  "Resume auto-fill is not set up yet. Please ask your admin to turn it on, then try again.";

export const AI_VALIDATION_MESSAGES = {
  AI_API_KEY_INVALID:
    "Resume auto-fill is not working right now. Please ask your admin to check the settings, then try again.",
  AI_MODEL_INVALID:
    "Resume auto-fill is not working right now. Please ask your admin to check the settings, then try again.",
  AI_RATE_LIMIT:
    "Too many resumes are being processed right now. Please wait a moment and try again.",
  AI_SERVICE_BUSY:
    "Our system is busy right now. Please wait a few seconds and upload again.",
  AI_NETWORK_ERROR:
    "We could not read this resume right now. Please try again in a moment.",
  API_CONFIG_NOT_SET: DEFAULT_API_CONFIG_ERROR,
  EXTRACT_TIMEOUT:
    "This resume is taking too long to read. Please try again with one file, or use a smaller PDF.",
  EXTRACT_NETWORK:
    "We could not finish reading this resume. Please try again, or upload fewer files at a time.",
  EXTRACT_GATEWAY:
    "This resume took too long to process. Please try again with one smaller file.",
};

/**
 * Plain language messages for normal users (no technical jargon).
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

  // Keep our own plain messages if already set
  if (
    Object.values(AI_VALIDATION_MESSAGES).some((msg) => raw.includes(msg.slice(0, 40)))
  ) {
    return raw;
  }

  if (
    lower.includes("invalid api key") ||
    lower.includes("api key not valid") ||
    lower.includes("unauthorized") ||
    lower.includes("invalid authentication") ||
    /oauth|sign-in|developers\.google|access token/i.test(raw)
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
    (lower.includes("model") &&
      (lower.includes("invalid") || lower.includes("not found"))) ||
    lower.includes("status code 404") ||
    lower.includes("not_found_error")
  ) {
    return AI_VALIDATION_MESSAGES.AI_MODEL_INVALID;
  }
  // Old technical / misleading copy
  if (
    lower.includes("verify your backend") ||
    lower.includes("backend server") ||
    lower.includes("hostinger") ||
    lower.includes("gemini") ||
    lower.includes("gateway") ||
    lower.includes("ocr") ||
    lower.includes("api key") ||
    lower.includes("claude")
  ) {
    return AI_VALIDATION_MESSAGES.EXTRACT_NETWORK;
  }

  // Prefer a simple fallback over raw technical text
  if (!raw || /error|exception|stack|undefined|null|econn|etimed/i.test(raw)) {
    return "We could not read this resume. Please try again.";
  }
  return raw;
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
