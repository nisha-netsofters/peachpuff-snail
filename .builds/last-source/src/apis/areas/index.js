import apiCall from "../../utility/axiosInterceptor";

/** Candidate form dropdown */
export const getAreasByCity = async ({ state = "", city = "" } = {}) => {
  const params = new URLSearchParams();
  if (state) params.set("state", state);
  if (city) params.set("city", city);
  const qs = params.toString();
  return await apiCall.get(`/areas${qs ? `?${qs}` : ""}`);
};

/** Super Admin list */
export const getAreasListAPI = async (payload) => {
  return await apiCall.post(
    `/areas/list?page=${payload.page}&perPage=${payload.perPage}`,
    payload.filterData || {}
  );
};

export const createAreaApi = async (data) => {
  return await apiCall.post("/areas/create", data);
};

export const updateAreaAPI = async (payload) => {
  return await apiCall.put(`/areas/update/${payload.id}`, payload.data);
};

export const deleteAreaAPI = async (payload) => {
  return await apiCall.delete(`/areas/delete/${payload.id}`);
};
