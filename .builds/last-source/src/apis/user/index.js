import apiCall from '../../utility/axiosInterceptor'

export const getUserAPI = async (payload) => {
    // return await apiCall.post('/users', payload)
    return await apiCall.post(`/users?page=${payload.page}&perPage=${payload.perPage}`, payload.filterData).then(res => {
        return res
    })

}
export const createUserAPI = async (payload) => {

    return await apiCall.post('/user/create', payload, {
        headers: { "Content-Type": "multipart/form-data" }
    })

}
export const updateUserAPI = async (payload) => {

    return await apiCall.put(`/user/update/${payload.id}`, payload.data, {
        headers: { "Content-Type": "multipart/form-data" }
    })

}
export const deleteUserAPI = async (payload) => {
    return await apiCall.delete(`/user/delete/${payload.id}`, {
        headers: { "Content-Type": "multipart/form-data" }
    })

}

export const getUserDetails = async (payload) => {
    return await apiCall.get(`/user/${payload.id}`, {
        headers: { "Content-Type": "multipart/form-data" }
    })
}
export const getLoginUserDetail = async (payload) => {
    return await apiCall.get(`/getUserData/${payload}`, {
        headers: { "Content-Type": "multipart/form-data" }
    })

}
export const createFreePlan = async (payload) => {

    return await apiCall.post(`/freeSubscription/${payload?.id}`, {
        headers: { "Content-Type": "multipart/form-data" }
    })

}
export const getFilterUser = async (payload) => {
    return await apiCall.post("/user/filter", payload).then(res => {
        return res
    })
}

export const getUserRoleWise = async (name) => {

    return await apiCall.get(`/user/with/role?name=${name}`).then(res => {
        return res
    })
}