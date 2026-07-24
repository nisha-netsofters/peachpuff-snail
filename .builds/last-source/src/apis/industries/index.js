import apiCall from '../../utility/axiosInterceptor'

export const getIndustriesAPI = async (payload) => {
    return await apiCall.post(`/industries?page=${payload.page}&perPage=${payload.perPage}`, payload.filterData).then(res => {
        return res
    })
}

export const getallIndustriesAPI = async () => {
    return await apiCall.post(`/industries/all`).then(res => {
        return res
    })
}
export const createIndustriesApi = async (payload) => {

    return await apiCall.post('/industries/create', payload, {
        headers: { "Content-Type": "multipart/form-data" }
    })
}
export const updateIndustriesAPI = async (payload) => {

    return await apiCall.put(`/industries/update/${payload.id}`, payload.data, {
        headers: { "Content-Type": "multipart/form-data" }
    })
}
export const deleteIndustriesAPI = async (payload) => {

    return await apiCall.delete(`/industries/delete/${payload.id}`, {
        headers: { "Content-Type": "multipart/form-data" }
    })
}
export const getFilterIndustries = async (payload) => {
    return await apiCall.post("/industries/filter", payload).then(res => {
        return res
    })
}
