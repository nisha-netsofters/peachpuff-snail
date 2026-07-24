import apiCall from "../../utility/axiosInterceptor";

export const getPlanList = async () => {
  return await apiCall.get(`/plans`).then((res) => {
    return res;
  });
};
export const getPlanbyId = async (payload) => {
  return await apiCall.post(`/getplanbyid`, payload).then((res) => {
    return res;
  });
};
