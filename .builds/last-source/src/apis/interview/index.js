import apiCall from '../../utility/axiosInterceptor'

export const getInterviewAPI = async (payload) => {
    // return await apiCall.get('/interviews', payload)
    return await apiCall.post(`/interviews?page=${payload.page}&perPage=${payload.perPage}&userId=${payload.userId}`, payload.filterData).then(res => {
        return res
    })
}
export const createInterviewAPI = async (payload) => {

    return await apiCall.post('/interviews/create', payload, {
        headers: { "Content-Type": "application/json" }
    })
}
export const updateInterviewAPI = async (payload) => {

    return await apiCall.put(`/interviews/update`, payload.data, {
        headers: { "Content-Type": "application/json" }
    })
}
export const deleteInterviewAPI = async (payload) => {

    return await apiCall.delete(`/interviews/delete/${payload.id}`, {
        headers: { "Content-Type": "application/json" }
    })
}
export const getFilterInterview = async (payload) => {
    return await apiCall.post("/interviews/filter", payload).then(res => {
        return res
    })
}
