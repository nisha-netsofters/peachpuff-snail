import apiCall from "../../utility/axiosInterceptor";

export const getjobOpeningAPI = async (payload) => {
  return await apiCall
    .post(
      `/jobOpenings?page=${payload.page}&perPage=${payload.perPage}&userId=${payload.userId}`,
      payload.filterData
    )
    .then((res) => {
      return res;
    });
};
export const createjobOpeningAPI = async (payload) => {
  return await apiCall.post("/jobOpening/create", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const updatejobOpeningAPI = async (payload) => {
  return await apiCall.put(`/jobOpening/${payload.id}`, payload.data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const deletejobOpeningAPI = async (payload) => {
  return await apiCall.delete(`/jobOpening/${payload.id}`, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const findByIdjobOpeningAPI = async (jobOpeningId) => {
  return await apiCall
    .get(`/jobOpening/find?id=${jobOpeningId}`)
    .then((res) => {
      return res;
    });
};
export const RestartjobOpeningAPI = async (payload) => {
  return await apiCall.get(`/jobOpening/activateagain/?id=${payload.id}`);
};

/**
 * AI Assisted Job Description Generator
 * action: generate | regenerate | improve | short | professional
 */
export const generateJobDescriptionAPI = async (payload) => {
  return await apiCall.post("/jobOpening/generate-description", payload);
};

export const updateJobPostingStatusAPI = async (payload) => {
  return await apiCall.put(`/jobOpening/${payload.id}/posting-status`, {
    postingStatus: payload.postingStatus,
  });
};

export const assignJobRecruiterAPI = async (payload) => {
  return await apiCall.put(`/jobOpening/${payload.id}/assign-recruiter`, {
    recruiterId: payload.recruiterId,
  });
};
