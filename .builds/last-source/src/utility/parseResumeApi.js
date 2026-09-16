import apiCall from "./axiosInterceptor";

/**
 * Extract resume fields via API.
 * Prefers publicParseResume so a stale/invalid admin token does not abort upload
 * (auth interceptor would otherwise clear session + redirect mid-request).
 */
export async function postParseResume(formData) {
  let result = null;

  try {
    result = await apiCall.post("/candidate/publicParseResume", formData);
  } catch (err) {
    result = err?.response?.data || null;
  }

  if (result?.success) return result;
  // Definitive OCR/AI validation errors — no point hitting auth with same file
  if (result?.code) return result;

  let authResult = null;
  try {
    authResult = await apiCall.post("/candidate/parse-resume", formData);
  } catch (err) {
    authResult = err?.response?.data || null;
  }

  if (authResult?.success || authResult?.code) return authResult;
  return authResult || result;
}
