import apiCall from '../../utility/axiosInterceptor'

export const getOnBoardingAPI = async (payload) => {
    return await apiCall.post(`/onBoardings?page=${payload.page}&perPage=${payload.perPage}&userId=${payload.userId}`, payload.filterData).then(res => {
        return res
    })
}
export const createOnBoardingAPI = async (payload) => {

    return await apiCall.post('/onBoarding', payload, {
        headers: { "Content-Type": "multipart/form-data" }
    })
}
export const updateOnBoardingAPI = async (payload) => {

    return await apiCall.put(`/onBoarding/${payload.id}`, payload.data, {
        headers: { "Content-Type": "multipart/form-data" }
    })

}
export const deleteOnBoardingAPI = async (payload) => {

    return await apiCall.delete(`/onBoarding/${payload.id}`, {
        headers: { "Content-Type": "multipart/form-data" }
    })

}
