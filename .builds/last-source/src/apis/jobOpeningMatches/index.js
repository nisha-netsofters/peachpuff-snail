import apiCall from "../../utility/axiosInterceptor"
import { buildJobMatchQueryString } from "./queryParams";

export const getJobOpeningRow = async (jobOpeningId) => {
    return await apiCall.get(`/jobOpening/find?id=${jobOpeningId}`).then(res => {
        return res
    })
}

export const getJobOpeningMatchCandidate = async (jobOpening) => {
    const qs = buildJobMatchQueryString(jobOpening);
    return await apiCall.post(`/jobOpening/bestmatchcandidate/${jobOpening?.id}?${qs}`).then(res => {
        return res
    })
}

export const getNewJobMatchCandidate = async (jobOpening) => {
    const qs = buildJobMatchQueryString(jobOpening);
    return await apiCall.post(`/jobOpening/newmatchcandidate/${jobOpening?.id}?${qs}`).then(res => {
        return res
    })
}