import apiCall from '../../utility/axiosInterceptor'

export const getFeedBackAPI = async (payload) => {
    return await apiCall.post(`/clientfeedback?page=${payload.page}&perPage=${payload.perPage}`, payload.filterData).then(res => {
        return res
    })
}
export const createFeedBackAPI = async (payload) => {
    return await apiCall.post('/clientfeedback/create', payload, {
        headers: { "Content-Type": "multipart/form-data" }
    })
}
export const updateFeedBackAPI = async (payload) => {
    return await apiCall.put(`/clientfeedback/update/${payload.id}`, payload.data, {
        headers: { "Content-Type": "multipart/form-data" }
    })
}
export const deleteFeedBackAPI = async (payload) => {
    return await apiCall.delete(`/clientfeedback/delete/${payload.id}`, {
        headers: { "Content-Type": "multipart/form-data" }
    })
}
export const getFilterFeedBack = async () => {
    // return await apiCall.post("/jobCategory/filter", payload).then(res => {
    //     return res
    // })
}
