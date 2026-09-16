import apiCall from "./axiosInterceptor";

const DEFAULT_API_CONFIG_ERROR =
  "Resume auto-extraction is unavailable. Please ask your Super Admin to enable and configure OCR & API Configuration (AI API key and model are required).";

const AI_VALIDATION_MESSAGES = {
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
  EMPTY_RESUME_TEXT:
    "Could not read text from this resume. Please upload a clear PDF, DOC, DOCX, or image.",
  RESUME_GATEWAY_TIMEOUT:
    "Resume extraction timed out (server took too long for OCR/AI). Please try a smaller PDF or upload again in a moment.",
  RESUME_NO_RESPONSE:
    "No response from the resume server. The request likely timed out — try a smaller file or try again.",
};

/**
 * User-facing message for resume extract failures (never blame "backend down" for timeouts).
 */
export function getFriendlyExtractError(result) {
  if (!result) {
    return AI_VALIDATION_MESSAGES.RESUME_NO_RESPONSE;
  }

  const status = Number(result.httpStatus || result.status || 0);
  if (status === 504 || status === 502 || status === 408) {
    return AI_VALIDATION_MESSAGES.RESUME_GATEWAY_TIMEOUT;
  }

  if (result.code && AI_VALIDATION_MESSAGES[result.code]) {
    return AI_VALIDATION_MESSAGES[result.code];
  }

  const raw = result.error || result.msg || result.message || "";
  const lower = String(raw).toLowerCase();

  if (
    lower.includes("timeout") ||
    lower.includes("timed out") ||
    lower.includes("gateway") ||
    status === 504
  ) {
    return AI_VALIDATION_MESSAGES.RESUME_GATEWAY_TIMEOUT;
  }
  if (
    lower.includes("network error") ||
    lower.includes("failed to fetch") ||
    lower.includes("err_failed")
  ) {
    return AI_VALIDATION_MESSAGES.RESUME_NO_RESPONSE;
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
  if (lower.includes("model") && (lower.includes("invalid") || lower.includes("not found"))) {
    return AI_VALIDATION_MESSAGES.AI_MODEL_INVALID;
  }
  if (lower.includes("status code 404") || lower.includes("not_found_error")) {
    return AI_VALIDATION_MESSAGES.AI_MODEL_INVALID;
  }
  if (/oauth|sign-in|developers\.google|access token/i.test(raw)) {
    return AI_VALIDATION_MESSAGES.AI_API_KEY_INVALID;
  }

  // Already a friendly message from a re-thrown Error
  if (
    raw.includes("timed out") ||
    raw.includes("No response from the resume server") ||
    raw.includes("Could not read text")
  ) {
    return raw;
  }

  return raw || AI_VALIDATION_MESSAGES.RESUME_NO_RESPONSE;
}

/**
 * Extract resume fields via publicParseResume only (one OCR/AI pass).
 */
export async function postParseResume(formData) {
  try {
    return await apiCall.post("/candidate/publicParseResume", formData);
  } catch (err) {
    const status = err?.response?.status;
    const data = err?.response?.data;

    if (data && typeof data === "object" && !Array.isArray(data)) {
      return { ...data, success: false, httpStatus: status };
    }

    if (status === 504 || status === 502 || status === 408) {
      return {
        success: false,
        code: "RESUME_GATEWAY_TIMEOUT",
        httpStatus: status,
        error: AI_VALIDATION_MESSAGES.RESUME_GATEWAY_TIMEOUT,
      };
    }

    // No response body (CORS on gateway HTML, network cut, etc.)
    if (!err?.response) {
      return {
        success: false,
        code: "RESUME_NO_RESPONSE",
        error: AI_VALIDATION_MESSAGES.RESUME_NO_RESPONSE,
      };
    }

    return {
      success: false,
      code: "RESUME_NO_RESPONSE",
      httpStatus: status,
      error:
        typeof data === "string" && data.trim()
          ? data.slice(0, 200)
          : AI_VALIDATION_MESSAGES.RESUME_NO_RESPONSE,
    };
  }
}
