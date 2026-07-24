import apiCall from "../../utility/axiosInterceptor";

export const getRecruiterInternalCommentsAPI = async (payload) => {
  return await apiCall.post(
    `/recruiter-internal-comments?page=${payload.page || 1}&perPage=${
      payload.perPage || 50
    }`,
    { candidateId: payload.candidateId }
  );
};

export const createRecruiterInternalCommentAPI = async (payload) => {
  return await apiCall.post("/recruiter-internal-comments/create", payload);
};

export const updateRecruiterInternalCommentAPI = async (payload) => {
  return await apiCall.put(
    `/recruiter-internal-comments/update/${payload.id}`,
    payload.data
  );
};

export const deleteRecruiterInternalCommentAPI = async (payload) => {
  return await apiCall.delete(
    `/recruiter-internal-comments/delete/${payload.id}`
  );
};
