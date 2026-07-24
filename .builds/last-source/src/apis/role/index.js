import apiCall from '../../utility/axiosInterceptor'


export const getRolesAPI = async () => {
    return await apiCall.get(`/roles`)

}