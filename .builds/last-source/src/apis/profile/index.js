import axios from 'axios'
import apiCall from '../../utility/axiosInterceptor'

export const profileUpdate = async (payload) => {
    return await apiCall.put(`/user/update/${payload.id}`, payload.data, {
        headers: { "Content-Type": "multipart/form-data" },
    })
}

export const GetQeCode = async () => {
    const baseURL =  process.env.REACT_APP_QR_CODE_BASE_URL
    const accessToken = process.env.REACT_APP_QR_CODE_ACCESS_TOKEN
   return await axios.get(`${baseURL}/whatsapp/QRCode?accessToken=${accessToken}`).then(res => {
    return res
   }).catch(err => {
    return err
   })
}

