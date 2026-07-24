import apiCall from "../../utility/axiosInterceptor";

export const createAgency = async (payload) => {
  return await apiCall.post("/superAdmin/agency", payload);
};

export const getAgency = async (payload) => {
  return await apiCall.post(
    `/superAdmin/searchAgency?page=${payload?.page}&perPage=${payload?.perPage}`,
    payload?.filterData
  );
};

export const updateAgency = async (payload) => {
  return await apiCall.put(`/superAdmin/agency`, payload);
};

export const deleteAgency = async (payload) => {
  return await apiCall.put(`/superAdmin/deleteAgency`, payload);
};

export const getAgencyDetailBySlug = async (payload) => {
  return await apiCall.get(`/agency/${payload}`);
};

export const getTransaction = async (payload) => {
  return await apiCall.post(`/superAdmin/transactionlist`, payload);
};

export const getAgencyDetailBySlugPublic = async (payload) => {
  return await apiCall.get(`/agencypublic/${payload}`);
};

export const agencyStatus = async (payload) => {
  return await apiCall.post(`/agency/active/${payload?.id || ""}`, {
    isDeleted: payload?.isDeleted != true,
  });
};
export const getAgencycount = async () => {
  return await apiCall.get(`/superAdmin/agencycount`);
};
export const getAgencyDashboard = async () => {
  return await apiCall.get(`/superAdmin/agencyDashboard`);
};

export const getAgencyDashboardTableData = async (payload) => {
  return await apiCall.post(`/superAdmin/agencylist`, payload);
};
export const updateAgencyValidity = async (payload) => {
  return await apiCall.post(`/superAdmin/updatevalidity`, payload);
};
