import apiCall from "../../utility/axiosInterceptor";

export const getWelcomeWhatsappConfig = async () => {
  return await apiCall.get("/welcomeWhatsapp/config");
};

export const saveWelcomeWhatsappConfig = async (payload) => {
  return await apiCall.put("/welcomeWhatsapp/config", payload);
};

export const getWelcomeWhatsappLogs = async (page = 1, perPage = 10) => {
  return await apiCall.get(
    `/welcomeWhatsapp/logs?page=${page}&perPage=${perPage}`
  );
};

export const deleteWelcomeWhatsappLogs = async (ids) => {
  return await apiCall.post("/welcomeWhatsapp/logs/delete", { ids });
};

export const clearWelcomeWhatsappLogs = async () => {
  return await apiCall.delete("/welcomeWhatsapp/logs");
};

export const uploadWelcomeWhatsappImage = async (formData) => {
  return await apiCall.post("/welcomeWhatsapp/upload-image", formData);
};
