import apiCall from "../../utility/axiosInterceptor";

export const decreaseResumeDownload = async (data) => {
  return await apiCall
    .put(
      `/subscriptions/decrease-reseume-download?userId=${data?.userId}&subscriptionId=${data?.subscriptionId}&candidateId=${data?.candidateId}`
    )
    .then((res) => {
      return res;
    });
};

export const getSubscriptionForClient = async (subscriptionId) => {
  return await apiCall
    .get(`/subscriptions?subscriptionId=${subscriptionId}`)
    .then((res) => {
      return res;
    });
};
