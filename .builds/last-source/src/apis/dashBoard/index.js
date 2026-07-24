import apiCall from '../../utility/axiosInterceptor'

export const statisticsAPI = async (payload) => {
    const userId = JSON.parse(localStorage.getItem("user"))
    return await apiCall.post(`/dashboard/statistics?year=${payload.year}&month=${payload.month}&userId=${userId?.id ? userId?.id : null}`).then(res => {
        return res
    })
}
export const recruiterWorkChartAPI = async (payload) => {
    return await apiCall.post(`/dashboard/recruitorsWork?year=${payload.recruiterYear}&month=${payload.recruiterMonth}`).then(res => {
        return res
    })
}
export const interviewChartAPI = async (payload) => {
    return await apiCall.post(`/dashboard/interviews?year=${payload.recruiterYear}`).then(res => {
        return res
    })
}
export const todayInterviewAPI = async (payload = {}) => {
    let userId = JSON.parse(localStorage.getItem("user"))
    if (userId?.role?.name !== "Recruiter") {
        userId = ""
    }
    // If candidateId is provided, use it instead of userId
    const candidateId = payload?.candidateId || "";
    const finalUserId = candidateId || (userId?.id ? userId?.id : "");
    return await apiCall.post(`/dashboard/todayInterviews?userId=${finalUserId}`).then(res => {
        return res
    })
}
export const candidateAPI = async (payload = {}) => {
    return await apiCall.post(`/dashboard/candidates`, payload?.filterData).then(res => {
        return res
    })
}
