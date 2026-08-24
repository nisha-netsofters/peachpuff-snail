import apiCall from "../../utility/axiosInterceptor";

export const getEducationsAPI = async ({ qualification = "" } = {}) => {
  const params = new URLSearchParams();
  if (qualification) params.set("qualification", qualification);
  const qs = params.toString();
  return await apiCall.get(`/education${qs ? `?${qs}` : ""}`);
};

export const getCoursesAPI = async ({ educationId = "" } = {}) => {
  const params = new URLSearchParams();
  if (educationId) params.set("educationId", educationId);
  const qs = params.toString();
  return await apiCall.get(`/courses${qs ? `?${qs}` : ""}`);
};

export const getEducationListAPI = async (payload) => {
  return await apiCall.post(
    `/education/list?page=${payload.page}&perPage=${payload.perPage}`,
    payload.filterData || {}
  );
};

export const createEducationApi = async (data) => {
  return await apiCall.post("/education/create", data);
};

export const updateEducationAPI = async (payload) => {
  return await apiCall.put(`/education/update/${payload.id}`, payload.data);
};

export const deleteEducationAPI = async (payload) => {
  return await apiCall.delete(`/education/delete/${payload.id}`);
};

export const getCourseListAPI = async (payload) => {
  return await apiCall.post(
    `/courses/list?page=${payload.page}&perPage=${payload.perPage}`,
    payload.filterData || {}
  );
};

export const createCourseApi = async (data) => {
  return await apiCall.post("/courses/create", data);
};

export const updateCourseAPI = async (payload) => {
  return await apiCall.put(`/courses/update/${payload.id}`, payload.data);
};

export const deleteCourseAPI = async (payload) => {
  return await apiCall.delete(`/courses/delete/${payload.id}`);
};
