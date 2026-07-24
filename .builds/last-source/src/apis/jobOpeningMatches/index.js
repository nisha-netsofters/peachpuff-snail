import apiCall from "../../utility/axiosInterceptor"

export const getJobOpeningRow = async (jobOpeningId) => {
    return await apiCall.get(`/jobOpening/find?id=${jobOpeningId}`).then(res => {
        return res
    })
}

export const getJobOpeningMatchCandidate = async (jobOpening) => {
    return await apiCall.post(`/jobOpening/bestmatchcandidate/${jobOpening?.id}?page=${jobOpening?.page}&perPage=${jobOpening?.perPage}`).then(res => {
        return res
    })
}