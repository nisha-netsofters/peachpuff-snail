// services/candidate.js (or wherever your APIs are)
import apiCall from "../../utility/axiosInterceptor";

export const postJobsApplyAPI = async (payload) => {
  // payload = { jobOpeningId: '...' }
  return await apiCall.post("/job/apply", payload).then((res) => res);
};
