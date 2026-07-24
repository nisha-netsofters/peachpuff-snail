import apiCall from "../../utility/axiosInterceptor";

export const getstatistics = async () => {
  return await apiCall.get(`/statistics`).then((res) => {
    return res;
  });
};
