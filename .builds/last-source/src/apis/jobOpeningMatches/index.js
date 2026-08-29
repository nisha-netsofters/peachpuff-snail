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

/** Fetch every best-match page for CSV export (same data as Best Match screen). */
export const fetchAllJobOpeningBestMatchCandidates = async (jobId) => {
    const perPage = 100;
    let page = 1;
    let allResults = [];
    let total = 0;

    do {
        const resp = await getJobOpeningMatchCandidate({
            id: jobId,
            page,
            perPage,
        });
        const batch = Array.isArray(resp?.results) ? resp.results : [];
        if (!batch.length) break;
        allResults = allResults.concat(batch);
        total = Number(resp?.total) || allResults.length;
        page += 1;
    } while (allResults.length < total);

    return allResults;
}