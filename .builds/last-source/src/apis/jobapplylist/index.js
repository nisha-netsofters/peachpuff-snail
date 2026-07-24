import apiCall from "../../utility/axiosInterceptor";

// NOTE:
// The axios interceptor already returns `resp.data`, not the full axios response.
// So this function will directly resolve to the parsed response body.
export const getJobApplyListAPI = async (jobId) => {
  return await apiCall.get(`/job/${jobId}/applicants`);
};