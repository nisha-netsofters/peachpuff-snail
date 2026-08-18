// import { useSelector } from "react-redux";
import apiCall from "../../utility/axiosInterceptor";

// export const getPlanId = async () => {
//   const planData = useSelector((state) => state?.auth?.user?.subscription)
//   return planData
// }

export const getCandidateAPI = async (payload) => {
  return await apiCall
    .post(
      `/candidates?page=${payload.page || 1}&perPage=${payload.perPage || 10}`,
      payload.filterData
    )
    .then((res) => {
      return res;
    });
};
export const toggleFavoriteCandidateAPI = async (payload) => {
  // Try primary + aliases (live Hostinger sometimes misses one registered path)
  const paths = [
    "/candidate/toggle-favorite",
    "/candidate/favorite",
    "/candidates/toggle-favorite",
    "/v2/candidate/toggle-favorite",
  ];
  let lastErr;
  for (const path of paths) {
    try {
      return await apiCall.post(path, payload);
    } catch (err) {
      lastErr = err;
      const status = err?.response?.status;
      if (status !== 404) throw err;
    }
  }
  throw lastErr;
};

export const getSavedCandidateAPI = async (payload) => {
  return await apiCall
    .post(
      `/candidate/savedcandidate?page=${payload.page || 1}&perPage=${
        payload.perPage || 10
      }`,
      payload.filterData
    )
    .then((res) => {
      return res;
    });
};
export const getClientCandidateAPI = async (payload, planId) => {
  return await apiCall
    .post(
      `/clients/candidates?planId=${planId}&page=${payload.page || 1}&perPage=${
        payload.perPage || 10
      }&isSavedCandidates=${payload?.isSavedCandidates || false}`,
      payload.filterData
    )
    .then((res) => {
      return res;
    });
};
export const getBestMatchesCandidateAPI = async (payload, planId) => {
  return await apiCall
    .post(
      `/clients/bestmatchcandidate?planId=${planId}&page=${
        payload.page || 1
      }&perPage=${payload.perPage || 10}&isSavedCandidates=${
        payload?.isSavedCandidates || false
      }`,
      payload.filterData
    )
    .then((res) => {
      return res;
    });
};
export const createCandidateAPI = async (payload) => {
  // Do not set Content-Type manually — browser must add multipart boundary
  return await apiCall.post("/candidate/create", payload);
};

export const createCandidateCsvAPI = async (payload) => {
  return await apiCall.post("/candidate/create/csv", payload);
};
export const updateCandidateAPI = async (payload) => {
  // Do not set Content-Type manually — browser must add multipart boundary
  return await apiCall.put(`/candidate/update`, payload.data);
};
export const updateCandidatePublicAPI = async (payload) => {
  return await apiCall.post(`/candidate/apply/update`, payload.data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const deleteCandidateAPI = async (payload) => {
  return await apiCall.delete(`/candidate/delete/${payload.id}`, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const getFilterCandidate = async (payload) => {
  return await apiCall
    .post(
      `/candidate/filter?page=${payload.page}&perPage=${payload.perPage}`,
      payload
    )
    .then((res) => {
      return res;
    });
};
export const candidateStatus = async (payload) => {
  return await apiCall.post(`/candidate/view/${payload.id}`, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const createCandidatePublicAPI = async (payload) => {
  return await apiCall.post("/candidate/publicCreate", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const checkCandidatePublicAPI = async (payload) => {
  return await apiCall.post("/candidate/check", payload);
};

export const getPublicCandidateForApplyAPI = async (id, slug) => {
  const q = slug ? `?slug=${encodeURIComponent(slug)}` : "";
  return await apiCall.get(`/candidate/public-apply/${id}${q}`);
};

export const hiredCandidateforClients = async (payload) => {
  return await apiCall
    .post(
      `/candidate/hired?id=${payload?.userId}&page=${payload.page}&perPage=${payload.perPage}`
    )
    .then((res) => {
      return res;
    });
};

export const candidatesForClients = async (payload) => {
  return await apiCall
    .post(
      `/candidates/client?page=${payload.page}&perPage=${payload.perPage}`,
      payload.filterData
    )
    .then((res) => {
      return res;
    });
};

export const sendMailToCandidates = async (payload) => {
  return await apiCall.post(`/candidate/mail`, payload).then((res) => {
    return res;
  });
};

export const getCandidateStatisticsAPI = async () => {
  return await apiCall.get(`/candidate/statistics`).then((res) => {
    return res;
  });
};

export const getCandidateJobMatchingAPI = async (payload) => {
  return await apiCall.post(`/candidate/jobmatching`, payload).then((res) => { 
    return res;
  });
};

export const getCandidateProfileAPI = async () => {
  return await apiCall.get(`/candidate/profile`).then((res) => res);
};

export const createResumeEnquiryAPI = async (userId, message) => {
  return await apiCall
    .post("/resume-enquiry/create", {
      userId,
      message,
    })
    .then((res) => res);
};

export const getResumeEnquiryStatusAPI = (userId) => {
  return apiCall.get(`/resume-enquiry/getStatusByUserId/${userId}`);
};
