import apiCall from "./axiosInterceptor";

/**
 * Extract resume fields via publicParseResume only (one OCR/AI pass).
 * Avoids auth parse-resume so stale tokens never abort upload, and never
 * runs a second full extract (that was doubling wait time).
 */
export async function postParseResume(formData) {
  try {
    return await apiCall.post("/candidate/publicParseResume", formData);
  } catch (err) {
    return err?.response?.data || null;
  }
}
