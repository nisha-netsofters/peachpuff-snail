import apiCall from '../../utility/axiosInterceptor'

export const getjobCatAPI = async (payload) => {
    // return await apiCall.get('/jobCategory', payload)
    return await apiCall.post(`/jobCategories?page=${payload.page}&perPage=${payload.perPage}`, payload.filterData).then(res => {
        return res
    })
}

export const getalljobCatAPI = async () => {
    // return await apiCall.get('/jobCategory', payload)
    return await apiCall.post(`/jobCategory/all`).then(res => {
        return res
    })
}
export const createjobCatAPI = async (payload) => {

    return await apiCall.post('/jobCategory/create', payload, {
        headers: { "Content-Type": "multipart/form-data" }
    })
}
export const updatejobCatAPI = async (payload) => {

    return await apiCall.put(`/jobCategory/update/${payload.id}`, payload.data, {
        headers: { "Content-Type": "multipart/form-data" }
    })
}
export const deletejobCatAPI = async (payload) => {

    return await apiCall.delete(`/jobCategory/delete/${payload.id}`, {
        headers: { "Content-Type": "multipart/form-data" }
    })
}
export const getFilterjobCat = async (payload) => {
    return await apiCall.post("/jobCategory/filter", payload).then(res => {
        return res
    })
}
