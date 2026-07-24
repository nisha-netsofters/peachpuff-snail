import apiCall from '../../utility/axiosInterceptor'

export const loginAPI = async (payload) => {
    return await apiCall.post('/user/login', payload)
}
export const loginEmailAPI = async (payload) => {
    return await apiCall.post('/user/verifyemail', payload)
}
export const superAdminLoginAPI = async (payload) => {
    return await apiCall.post("/superAdmin/login", payload);
}
export const check_token = async (token) => {
    return await apiCall.post(`/user/check/token?token=${token}`)
}
export const userGetAPI = async (id) => {
    return await apiCall.get(`/user/${id}`)
}

export const forgotPassword = async (payload) => {
    return await apiCall.post(`/user/forgot/password`, payload)
}

export const resetPassword = async (payload) => {
    return await apiCall.post(`/user/password/reset?id=${payload.id}&token=${payload.token}`, payload)
}

export const changePassword = async (payload) => {
    return await apiCall.put(`/user/password/${payload.id}`, payload)
}