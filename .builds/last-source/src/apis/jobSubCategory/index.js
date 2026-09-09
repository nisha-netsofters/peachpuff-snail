import apiCall from "../../utility/axiosInterceptor";

export const getJobSubCatAPI = async (payload) => {
  return await apiCall.post(
    `/jobSubCategories?page=${payload.page}&perPage=${payload.perPage}`,
    payload.filterData || {}
  );
};

export const getAllJobSubCatAPI = async (payload = {}) => {
  return await apiCall.post(`/jobSubCategory/all`, payload);
};

export const createJobSubCatAPI = async (payload) => {
  return await apiCall.post("/jobSubCategory/create", payload);
};

export const updateJobSubCatAPI = async (payload) => {
  return await apiCall.put(
    `/jobSubCategory/update/${payload.id}`,
    payload.data
  );
};

export const deleteJobSubCatAPI = async (payload) => {
  return await apiCall.delete(`/jobSubCategory/delete/${payload.id}`);
};
