import apiCall from "../../utility/axiosInterceptor";

export const getLeadAPI = async (payload) => {
  return await apiCall
    .post(
      `/lead?page=${payload.page}&perPage=${payload.perPage}`,
      payload.filterData
    )
    .then((res) => {
      return res;
    });
};
export const createLeadAPI = async (payload) => {
  return await apiCall.post("/lead/create", payload);
};
export const updateLeadAPI = async (payload) => {
  return await apiCall.put(`/lead/update/${payload.id}`, payload.data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const deleteLeadAPI = async (payload) => {
  return await apiCall.delete(`/lead/delete/${payload.id}`, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const getFilterLead = async () => {
  //     return await apiCall.post("/jobCategory/filter", payload).then(res => {
  //         return res
  //     })
};

export const approveLead = async (data) => {
  return await apiCall.post(`/lead/approve/${data?.id}`).then((res) => {
    return res;
  });
};

export const declinedLead = async (data) => {
  return await apiCall.delete(`/lead/delete/${data?.id}`).then((res) => {
    return res;
  });
};
