import apiCall from "../../utility/axiosInterceptor";

export const getApiIntegrationConfig = async () => {
  return await apiCall.get("/apiIntegration/config");
};

export const saveApiIntegrationConfig = async (payload) => {
  return await apiCall.put("/apiIntegration/config", payload);
};

export const getActiveApiProviders = async () => {
  return await apiCall.get("/apiIntegration/active");
};
