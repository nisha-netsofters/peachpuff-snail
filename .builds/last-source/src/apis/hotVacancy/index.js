import apiCall from "../../utility/axiosInterceptor";

export const getHotVacancy = async (payload) => {
  return await apiCall.post(
    `jobOpening/hotvacancy?page=${payload?.page}&perPage=${payload?.perPage}`,
    payload?.filterData
  );
};
